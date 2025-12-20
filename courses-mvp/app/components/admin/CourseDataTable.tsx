"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { CourseForm } from "./CourseForm"; // Import Form của bạn

// Định nghĩa Type cho Props
interface CourseDataTableProps {
  data: any[]; // Dữ liệu khóa học
  categories: any[]; // 👈 THÊM DÒNG NÀY: Nhận danh sách category từ Page
}

export default function CourseDataTable({ data, categories }: CourseDataTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Mở modal để tạo mới
  const handleOpenCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  // Mở modal để sửa
  const handleOpenEdit = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Tạo khóa học
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Tên khóa học</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{course.title}</td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    course.price
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      course.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {course.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {categories.map((cat) => {
                    if (course.category_id === cat.id) {
                      return <div key={cat.id}>{cat.name}</div>;
                    }
                    {
                      console.log(course.categoryId, cat.id);
                    }
                    return null;
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Thêm nút xóa nếu cần */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PHẦN QUAN TRỌNG NHẤT: TRUYỀN CATEGORIES XUỐNG FORM --- */}
      <CourseForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedCourse}
        categories={categories} // 👈 KHÔNG ĐƯỢC QUÊN DÒNG NÀY
      />
    </div>
  );
}
