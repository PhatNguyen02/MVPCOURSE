"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryModal from "./EditCategory"; // <--- IMPORT FIXED HERE
import { deleteCategory, upsertCategory } from "@/app/actions/category";

interface CategoryListClientProps {
  initialCategories: any[];
}

export default function CategoryListClient({ initialCategories }: CategoryListClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // 1. Open for Create
  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // 2. Open for Edit
  const handleOpenEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // 3. Handle Submit (Create or Update)
  const handleFormSubmit = async (formData: any) => {
    try {
      // Gọi Server Action
      const result = await upsertCategory({
        id: formData.id,
        name: formData.name,
        description: formData.description,
      });

      if (result.success) {
        // Đóng modal nếu thành công (dữ liệu tự động cập nhật nhờ revalidatePath)
        // Bạn có thể thêm Toast thông báo thành công ở đây
        console.log(result.message);
      } else {
        alert(result.message); // Thông báo lỗi đơn giản
      }
    } catch (error) {
      console.error("Lỗi client:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  // --- 4. HÀM XỬ LÝ XÓA (Thêm vào nút Trash) ---
  const handleDelete = async (id: string | number) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await deleteCategory(id);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500">Phân loại các khóa học trên hệ thống</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-2 flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 ml-1" />
            <input placeholder="Tìm danh mục..." className="text-sm outline-none w-full" />
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tên danh mục</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4 text-center">Số khóa học</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                  {category.id.toString().substring(0, 8)}...
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">
                  {category.description || `Phân loại khóa học ${category.name}`}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                    {category._count?.courses || 0} sản phẩm
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(category)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialCategories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  <p>Chưa có danh mục nào được tạo.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
      />
    </>
  );
}
