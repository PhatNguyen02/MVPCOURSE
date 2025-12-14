import React from "react";
import { Check, ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseSidebar from "../../components/public/CourseSideBar"; // Import Sidebar vừa sửa ở bước 2

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  // 1. Lấy ID từ URL
  const { id } = await params;

  // 2. Gọi DB lấy dữ liệu thật
  const rawCourse = await prisma.course.findUnique({
    where: {
      id: id,
    },
  });

  if (!rawCourse) {
    return notFound();
  }

  // 3. Chuẩn hóa dữ liệu để truyền xuống Client
  const course = {
    ...rawCourse,
    price: Number(rawCourse.price), // Chuyển Decimal sang Number để tránh lỗi
    description: rawCourse.description || "Chưa có mô tả cho khóa học này.",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Nội dung chính */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
                Development
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* Box: Bạn sẽ học được gì */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Bạn sẽ học được gì?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Hiểu sâu về kiến thức nền tảng",
                  "Xây dựng dự án thực tế",
                  "Tối ưu hóa hiệu năng",
                  "Deploy sản phẩm lên Internet",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content - Danh sách bài học (Demo tĩnh) */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Nội dung khóa học</h3>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {[
                  { title: "Giới thiệu & Cài đặt", duration: "15 phút" },
                  { title: "Kiến thức cốt lõi", duration: "30 phút" },
                  { title: "Dự án thực chiến", duration: "60 phút" },
                ].map((chapter, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{chapter.title}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{chapter.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Nơi chứa nút Mua & Modal) */}
          <div className="lg:col-span-1">
            {/* Truyền toàn bộ object course vào Sidebar */}
            <CourseSidebar course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
