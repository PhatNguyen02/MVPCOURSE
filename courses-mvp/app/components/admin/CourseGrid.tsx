// File: app/(admin)/admin/courses/page.tsx
import React from "react";
import { prisma } from "@/lib/prisma";
import CourseDataTable from "./CourseDataTable"; // Import component bảng sẽ tạo ở bước 2

export const dynamic = "force-dynamic"; // Bắt buộc render lại mỗi lần vào (để data luôn mới)

export default async function AdminCoursesPage() {
  // 1. Lấy dữ liệu từ Supabase
  const rawCourses = await prisma.course.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  // 2. Serialize dữ liệu (Decimal -> Number, Date -> String) để truyền qua Client
  const courses = rawCourses.map((course) => ({
    ...course,
    price: Number(course.price),
    created_at: course.created_at?.toISOString() || "",
    updated_at: course.updated_at?.toISOString() || "",
    thumbnail_url: course.thumbnail_url || "",
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
        <p className="text-gray-500 mt-2">Xem, chỉnh sửa và quản lý các khóa học của bạn.</p>
      </div>

      {/* Truyền dữ liệu thật xuống bảng */}
      <CourseDataTable initialData={courses} />
    </div>
  );
}
