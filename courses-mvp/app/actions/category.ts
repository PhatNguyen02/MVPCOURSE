"use server"; // Bắt buộc dòng này ở đầu file

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Định nghĩa kiểu dữ liệu đầu vào
interface CategoryFormState {
  id?: string | number;
  name: string;
  description?: string;
}
interface CategoryFormState {
  id?: string | number;
  name: string;
  description?: string;
}

export async function upsertCategory(data: CategoryFormState) {
  try {
    // 1. Kiểm tra dữ liệu cơ bản
    if (!data.name || data.name.trim() === "") {
      return { success: false, message: "Tên danh mục không được để trống" };
    }

    // 2. Kiểm tra xem là Tạo mới (Create) hay Cập nhật (Update)
    if (data.id) {
      // --- UPDATE ---
      await prisma.category.update({
        where: { id: String(data.id) },
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

    // 3. RevalidatePath: Quan trọng để làm mới dữ liệu
    // ⚠️ LƯU Ý: Kiểm tra kỹ đường dẫn này trùng khớp với thư mục app/admin/... của bạn
    revalidatePath("/admin/category");

    return { success: true, message: "Lưu thành công!" };
  } catch (error: any) {
    console.error("Lỗi Server Action:", error);

    // 👇 ĐOẠN CODE MỚI THÊM VÀO ĐÂY
    // P2002 là mã lỗi của Prisma khi vi phạm "Unique constraint" (trùng lặp)
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Tên danh mục này đã tồn tại! Vui lòng chọn tên khác.",
      };
    }

    // Lỗi không xác định
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
