"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth"; // Import auth để check quyền admin nếu cần

// Hàm update khóa học
export async function updateCourse(courseId: string, values: any) {
  // 🔍 LOG 1: Kiểm tra dữ liệu đầu vào từ Form gửi lên
  console.log("👉 [SERVER ACTION] Đang chạy updateCourse...");
  console.log("👉 [INPUT] ID:", courseId);
  console.log("👉 [INPUT] Values:", JSON.stringify(values, null, 2));

  try {
    // Check user (Optional: Bật lên nếu muốn chỉ Admin mới được sửa)
    // const session = await auth();
    // if (!session) throw new Error("Unauthorized");

    // 1. Thực hiện Update vào DB
    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title: values.title,
        description: values.description,
        price: values.price, // Prisma tự xử lý Decimal nếu input là number
        category_id: values.category_id,
        is_published: values.is_published,
        drive_folder_url: values.drive_folder_url,
        thumbnail_url: values.thumbnail_url,
        // slug: values.slug, // Mở ra nếu bạn muốn cho sửa slug
      },
    });

    // 🔍 LOG 2: Nếu thành công
    console.log("✅ [SUCCESS] Đã update xong course:", course.id);

    // 2. Refresh lại dữ liệu trang admin để thấy thay đổi ngay
    revalidatePath(`/admin/courses`);
    revalidatePath(`/courses/${courseId}`);

    return { success: true, data: course };
  } catch (error: any) {
    // 🔍 LOG 3: Bắt lỗi chi tiết
    console.error("❌ [ERROR] Lỗi Update:", error);

    // Trả lỗi về cho Client hiển thị
    return { success: false, error: error.message || "Lỗi server nội bộ" };
  }
}
export async function createCourse(values: any) {
  console.log("👉 [ACTION CREATE] Đang tạo khóa học mới...", values);

  try {
    // Check quyền (Tùy chọn)
    const session = await auth();
    // if (!session) throw new Error("Chưa đăng nhập");

    // Xử lý dữ liệu
    const isPublished = values.status === "Published";
    const priceDecimal = values.price ? parseFloat(values.price) : 0;

    // Gọi DB tạo mới
    const newCourse = await prisma.course.create({
      data: {
        title: values.title,
        price: priceDecimal,
        drive_folder_url: values.driveLink,
        thumbnail_url: values.thumbnail,
        is_published: isPublished,
        description: values.description,
        // user_id: session?.user?.id // Nếu muốn lưu người tạo
      },
    });

    console.log("✅ Tạo thành công:", newCourse.id);

    // Refresh trang Admin để thấy dòng mới hiện ra ngay
    revalidatePath("/admin/courses");

    return { success: true, data: newCourse };
  } catch (error: any) {
    console.error("❌ Lỗi tạo khóa học:", error);
    return { success: false, error: error.message };
  }
}
