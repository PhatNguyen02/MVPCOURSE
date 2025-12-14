"use server"; // Bắt buộc dòng này ở đầu file

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Định nghĩa kiểu dữ liệu đầu vào
interface CategoryFormState {
  id?: string | number;
  name: string;
  description?: string;
}

export async function upsertCategory(data: CategoryFormState) {
  try {
    // 1. Kiểm tra dữ liệu cơ bản
    if (!data.name) {
      return { success: false, message: "Tên danh mục không được để trống" };
    }

    // 2. Kiểm tra xem là Tạo mới (Create) hay Cập nhật (Update)
    if (data.id) {
      // --- UPDATE ---
      await prisma.category.update({
        where: { id: String(data.id) }, // Đảm bảo ID là string nếu DB dùng UUID
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } else {
      // --- CREATE ---
      await prisma.category.create({
        data: {
          name: data.name,
          description: data.description || "",
        },
      });
    }

    // 3. RevalidatePath: Làm mới dữ liệu trên trang Admin ngay lập tức mà không cần F5
    revalidatePath("/admin/categories"); // Thay đường dẫn này bằng đường dẫn thực tế của trang bạn

    return { success: true, message: "Thành công!" };
  } catch (error) {
    console.error("Lỗi Server Action:", error);
    return { success: false, message: "Đã có lỗi xảy ra khi lưu dữ liệu." };
  }
}

// Hàm xóa (tiện tay làm luôn)
export async function deleteCategory(id: string | number) {
  try {
    await prisma.category.delete({
      where: { id: String(id) },
    });
    revalidatePath("/admin/categories");
    return { success: true, message: "Đã xóa danh mục" };
  } catch (error) {
    return { success: false, message: "Không thể xóa danh mục này" };
  }
}

export async function getCategory(id: string | number) {
  try {
    await prisma.category.delete({
      where: { id: String(id) },
    });
    revalidatePath("/admin/categories");
    return { success: true, message: "Đã xóa danh mục" };
  } catch (error) {
    return { success: false, message: "Không thể xóa danh mục này" };
  }
}
