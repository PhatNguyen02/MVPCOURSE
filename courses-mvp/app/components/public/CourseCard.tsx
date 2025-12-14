// File: components/public/CourseCard.tsx
"use client";

import Link from "next/link";
import { Users } from "lucide-react";

// CẬP NHẬT INTERFACE: Đổi Date -> string
interface CourseProps {
  id: string;
  title: string;
  description: string | null;
  price: number;
  drive_folder_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean | null;

  // 👇 SỬA LỖI TẠI ĐÂY:
  // Vì bên Server đã .toISOString() nên ở đây phải nhận string
  created_at: string;
  updated_at: string;
}

export default function CourseCard({ course }: { course: CourseProps }) {
  const detailUrl = `/course/${course.id}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link
        href={detailUrl}
        className="block relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          // Đảm bảo thumbnail_url không null (đã xử lý ở page.tsx nhưng check thêm cho chắc)
          src={course.thumbnail_url || "https://placehold.co/600x400?text=No+Image"}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 uppercase tracking-wide">
            Development
          </span>
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Users className="w-3 h-3" />
            <span>120 học viên</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          <Link href={detailUrl}>{course.title}</Link>
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Học phí</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</span>
          </div>
          <Link
            href={detailUrl}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Xem ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
