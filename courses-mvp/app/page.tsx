import Navbar from "./components/public/Navbar";
import CourseCard from "./components/public/CourseCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. Lấy dữ liệu THÔ từ Database
  const rawCourses = await prisma.course.findMany({
    // Nếu muốn filter ngay từ DB thì dùng: where: { isPublished: true }
    take: 3,
    orderBy: {
      // Sửa: created_at -> createdAt (theo Schema mới)
      created_at: "desc",
    },
    // Lấy thêm thông tin danh mục để hiển thị
    include: {
      category: true,
    },
  });

  // 2. CHẾ BIẾN DỮ LIỆU (Mapping từ camelCase DB -> snake_case Component)
  const courses = rawCourses
    // Sửa: is_published -> isPublished
    .filter((course) => course.is_published === true)
    .map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: Number(course.price), // Decimal -> Number

      // Map các trường mới (camelCase) sang props cũ (snake_case) của CourseCard
      thumbnail_url: course.thumbnail_url ?? "",
      drive_folder_url: course.drive_folder_url,
      is_published: course.is_published,

      // Xử lý hiển thị tên danh mục
      categoryName: course.category?.name || "Chưa phân loại",

      // Convert Date sang String (ISO) để tránh lỗi serialize của Next.js
      created_at: course.created_at.toISOString(),
      updated_at: course.updated_at.toISOString(),
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nền tảng học trực tuyến số 1
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
              Nâng tầm kỹ năng <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Làm chủ tương lai
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700">
              Truy cập các khóa học chất lượng cao, thanh toán dễ dàng qua QR, và nhận tài liệu ngay
              lập tức qua Google Drive.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-1000">
              <Link
                href="#courses"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Khám phá ngay <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <div className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Thanh toán QR", "Link Drive Tốc độ cao", "Hỗ trợ 24/7", "Cập nhật trọn đời"].map(
              (feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> {feature}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* COURSE LIST SECTION */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Khóa học nổi bật</h2>
              <p className="text-gray-500">Những khóa học được mua nhiều nhất tuần qua.</p>
            </div>
            <Link
              href="/course"
              className="hidden md:flex items-center text-blue-600 font-medium hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Render danh sách khóa học */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                // @ts-ignore: Bỏ qua lỗi type tạm thời nếu CourseCard chưa update interface
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">Chưa có khóa học nào được xuất bản.</p>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/course"
              className="inline-flex items-center text-blue-600 font-medium hover:underline"
            >
              Xem tất cả khóa học <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 CourseMaster. Nền tảng học tập Vibe Coding.
          </p>
        </div>
      </footer>
    </div>
  );
}
