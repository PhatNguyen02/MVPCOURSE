import CourseCard from "../components/public/CourseCard";
import CourseFilters from "../components/public/CourseFilters";
import Pagination from "../components/public/Pagination";
import { prisma } from "@/lib/prisma";
import Navbar from "../components/public/Navbar";
import { Prisma } from "@prisma/client";
// File: app/courses/page.tsx

// Lưu ý: Kiểm tra lại đường dẫn import component cho đúng với cấu trúc dự án của bạn

interface SearchParamsProps {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 6;

export default async function CoursesPage({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const search = params.search || "";
  const categoryId = params.categoryId || undefined;
  const currentPage = Number(params.page) || 1;

  // 1. CẬP NHẬT: Dùng tên trường camelCase khớp với Schema mới
  const whereCondition: Prisma.CourseWhereInput = {
    is_published: true, // Sửa: is_published -> isPublished
    title: {
      contains: search,
      mode: "insensitive",
    },
    ...(categoryId && { categoryId }),
  };

  const [rawCourses, totalCount, categories] = await Promise.all([
    prisma.course.findMany({
      where: whereCondition,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      // 2. CẬP NHẬT: created_at -> createdAt
      orderBy: { created_at: "desc" },
      include: { category: true },
    }),
    prisma.course.count({ where: whereCondition }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 3. CẬP NHẬT: Mapping dữ liệu từ Schema mới (camelCase) sang Props cũ (snake_case)
  // (Để không phải sửa lại file CourseCard.tsx)
  const courses = rawCourses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    price: Number(course.price),

    // Map trường mới (thumbnailUrl) sang tên prop cũ (thumbnail_url)
    thumbnail_url: course.thumbnail_url ?? "",
    drive_folder_url: course.drive_folder_url,

    is_published: course.is_published,

    categoryName: course.category_id || "Chưa phân loại",

    // Map trường mới (createdAt) sang tên prop cũ (created_at)
    created_at: course.created_at.toISOString(),
    updated_at: course.updated_at.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tất cả khóa học</h1>
          <p className="text-gray-600">Khám phá kiến thức mới mỗi ngày.</p>
        </div>

        <CourseFilters categories={categories} />

        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                // @ts-ignore: Bỏ qua lỗi type tạm thời nếu CourseCard chưa update interface
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <Pagination totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-lg text-gray-500 font-medium">
              Không tìm thấy khóa học nào phù hợp.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Thử thay đổi từ khóa hoặc bộ lọc xem sao nhé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
