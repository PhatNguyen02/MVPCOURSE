"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth";
import payOS from "@/lib/payos"; // Import file cấu hình payos bạn đã tạo
// 1. TẠO ĐƠN HÀNG (User gọi)
// export async function createOrder(courseId: string, price: number, email: string, name: string) {
//   try {
//     // Tạo mã đơn hàng ngắn gọn (VD: KH12345) để khách ghi nội dung CK
//     const orderCode = `KH${Math.floor(10000 + Math.random() * 90000)}`;
//     const session = await auth(); // 👈 Lấy session trên server cực dễ
//     const userId = session?.user?.id;
//     const newOrder = await prisma.order.create({
//       data: {
//         code: orderCode,
//         user_id: userId || null,
//         course_id: courseId,
//         amount: price, // Lưu ý: Database là Decimal, Prisma tự map số này ok
//         customer_email: email,
//         customer_name: name,
//         status: "PENDING",
//       },
//     });

//     // Trả về dữ liệu đơn giản (convert Decimal sang number/string để tránh lỗi Next.js serialize)
//     return {
//       success: true,
//       order: {
//         ...newOrder,
//         amount: Number(newOrder.amount), // Ép kiểu Decimal về Number
//         created_at: newOrder.created_at.toISOString(),
//       },
//     };
//   } catch (error) {
//     console.error("Create Order Error:", error);
//     return { success: false, error: "Lỗi tạo đơn hàng" };
//   }
// }

export async function createOrder(courseId: string, price: number, email: string, name: string) {
  try {
    // 1. Tạo mã đơn hàng LÀ SỐ (Bắt buộc theo PayOS)
    // Dùng timestamp để đảm bảo duy nhất: ví dụ 170000...
    // Cắt lấy 6-10 số cuối để làm mã đơn cho gọn
    const orderCode = Number(String(Date.now()).slice(-6));

    // 2. Lưu đơn hàng vào Database trước (Status: PENDING)
    const newOrder = await prisma.order.create({
      data: {
        code: String(orderCode), // DB lưu string cũng được
        course_id: courseId,
        amount: price,
        customer_email: email,
        customer_name: name,
        status: "PENDING",
      },
    });

    // 3. Tạo Link thanh toán PayOS
    // Lưu ý: Sửa domain 'http://localhost:3000' thành domain thật khi deploy
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const paymentBody = {
      orderCode: orderCode,
      amount: price,
      description: `Thanh toan don ${orderCode}`,
      cancelUrl: `${domain}/courses/${courseId}`, // Khách hủy thì quay lại trang khóa học
      returnUrl: `${domain}/payment-success`, // Thanh toán xong thì đi đến trang cảm ơn
    };

    const paymentLinkRes = await payOS.paymentRequests.create(paymentBody);

    // 4. Trả về checkoutUrl cho Client redirect
    return {
      success: true,
      checkoutUrl: paymentLinkRes.checkoutUrl,
    };
  } catch (error: any) {
    console.error("Lỗi tạo đơn hàng:", error);
    return { success: false, error: error.message };
  }
}

// 2. DUYỆT ĐƠN HÀNG (Admin gọi)
export async function approveOrder(orderId: string) {
  try {
    // A. Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return { success: false, error: "Không tìm thấy đơn hàng" };

    // B. Transaction: Cập nhật trạng thái + Cấp khóa học cho User
    await prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái đơn -> SUCCESS
      await tx.order.update({
        where: { id: orderId },
        data: { status: "SUCCESS" },
      });

      // 2. Nếu User đã có tài khoản (check theo email), cấp quyền học luôn
      // (Logic nâng cao: Nếu chưa có user thì có thể tạo user tạm, nhưng ở MVP ta check email)
      const user = await tx.user.findUnique({ where: { email: order.customer_email } });

      if (user) {
        // Cấp quyền học (Thêm vào bảng UserCourse)
        await tx.userCourse
          .create({
            data: {
              user_id: user.id,
              course_id: order.course_id,
            },
          })
          .catch(() => {
            // Bỏ qua lỗi nếu đã có khóa học rồi (do unique constraint)
            console.log("User đã sở hữu khóa học này rồi");
          });
      }
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Approve Error:", error);
    return { success: false, error: "Lỗi duyệt đơn" };
  }
}
