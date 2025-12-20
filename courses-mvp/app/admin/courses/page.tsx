import { prisma } from "@/lib/prisma";
import CourseDataTable from "@/app/components/admin/CourseDataTable";

// Đảm bảo trang luôn lấy dữ liệu mới nhất
export const dynamic = "force-dynamic";

export default async function Page() {
  // 1. Lấy dữ liệu thô từ Prisma (chứa Decimal)
  const rawCourses = await prisma.course.findMany({
    orderBy: { created_at: "desc" },
    include: {
      category: true,
    },
  });

  // 2. Lấy danh sách Categories
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // 3. 👇 QUAN TRỌNG: Chuyển đổi dữ liệu (Serialize)
  // Chuyển Decimal -> Number để Next.js hiểu được
  const courses = rawCourses.map((course) => ({
    ...course,
    price: course.price.toNumber(), // 👈 FIX LỖI TẠI ĐÂY: Chuyển Decimal thành số
    // Nếu created_at bị lỗi tương tự thì thêm dòng dưới:
    // created_at: course.created_at.toISOString(),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý khóa học</h1>
    
      {/* Truyền biến 'courses' đã được xử lý (không dùng rawCourses) */}
      <CourseDataTable data={courses} categories={categories} />
    </div>
  );
}
