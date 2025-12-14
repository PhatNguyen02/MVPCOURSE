"use client";

import React, { useState } from "react";
import { PlayCircle, Award, FileText, Globe } from "lucide-react";
import { CheckoutModal } from "./Checkout"; // Import Modal thanh toán của bạn

interface CourseSidebarProps {
  course: any; // Hoặc định nghĩa type Course cụ thể nếu có
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8">
        {/* Thumbnail Video Preview (Giả lập) */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6 group cursor-pointer">
          {/* Nếu có video intro thì để ở đây, ko thì để ảnh */}
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              No Image
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
            <PlayCircle className="w-12 h-12 text-white opacity-90" />
          </div>
        </div>

        {/* Giá tiền */}
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-gray-900">
            {new Intl.NumberFormat("vi-VN").format(course.price)} đ
          </span>
        </div>

        {/* Nút Mua Ngay - Kích hoạt Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 mb-4 active:scale-[0.98]"
        >
          Mua khóa học ngay
        </button>

        <p className="text-xs text-center text-gray-500 mb-6">Đảm bảo hoàn tiền trong 30 ngày</p>

        {/* List tính năng */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <PlayCircle className="w-4 h-4 text-gray-400" />
            <span>Tổng thời lượng: 12h 30p</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>35 bài giảng</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Globe className="w-4 h-4 text-gray-400" />
            <span>Học mọi lúc mọi nơi</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Award className="w-4 h-4 text-gray-400" />
            <span>Chứng chỉ hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Đặt Modal ở đây - Nó sẽ hiện lên khi isModalOpen = true */}
      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} course={course} />
    </>
  );
}
