"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import payOS from "@/lib/payos";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================================================
// 1. TẠO ĐƠN HÀNG & LẤY LINK PAYOS (Frontend gọi cái này)
// =========================================================
export async function createOrder(courseId: string, price: number, email: string, name: string) {
  try {
    // --- BƯỚC 1: Tạo mã đơn hàng chuẩn cho PayOS ---
    // PayOS yêu cầu orderCode là số nguyên (Number), không được chứa chữ cái
    // Giới hạn: nhỏ hơn 9007199254740991. Dùng timestamp hoặc random số.
    // Cách an toàn: Lấy 6-8 số cuối của timestamp + random
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 10)); // VD: 823456

    // --- BƯỚC 2: Lưu vào Database ---
    // Dù PayOS cần số, nhưng trong DB Prisma bạn cứ lưu String cho linh hoạt cũng được
    const newOrder = await prisma.order.create({
      data: {
        code: String(orderCode), // Lưu "823456" (dạng string) vào DB
        course_id: courseId,
        amount: price,
        customer_email: email,
        customer_name: name,
        status: "PENDING",
      },
      include: { course: true }, // Include để lấy tên khóa học cho PayOS description
    });

    // --- BƯỚC 3: Gọi PayOS tạo Link thanh toán ---
    const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const paymentBody = {
      orderCode: orderCode, // Bắt buộc là NUMBER
      amount: price,
      description: `Thanh toan don ${orderCode}`,
      buyerName: name,
      buyerEmail: email,
      cancelUrl: `${domain}/payment-success?cancel=true`, // Quay về trang success nhưng báo lỗi
      returnUrl: `${domain}/payment-success`, // Quay về trang success
      items: [
        {
          name: newOrder.course.title || "Khoa hoc",
          quantity: 1,
          price: price,
        },
      ],
    };

    const paymentLinkRes = await payOS.paymentRequests.create(paymentBody);

    // --- BƯỚC 4: Trả về Checkout URL cho Client ---
    return {
      success: true,
      checkoutUrl: paymentLinkRes.checkoutUrl,
      orderCode: orderCode,
    };
  } catch (error: any) {
    console.error("Lỗi tạo đơn hàng:", error);
    return { success: false, error: error.message };
  }
}

// =========================================================
// 2. HÀM DUYỆT ĐƠN & GỬI MAIL (Dùng nội bộ hoặc Admin)
// =========================================================
export async function approveOrder(orderId: string) {
  try {
    // A. Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) return { success: false, error: "Không tìm thấy đơn hàng" };

    // B. Cập nhật Database (Transaction)
    await prisma.$transaction(async (tx) => {
      // 1. Đổi trạng thái -> SUCCESS
      await tx.order.update({
        where: { id: orderId },
        data: { status: "SUCCESS" },
      });

      // 2. Logic tìm User để cấp quyền học
      let targetUserId = order.user_id;

      // Nếu đơn không có user_id (Khách mua), thử tìm user theo email
      if (!targetUserId) {
        const userByEmail = await tx.user.findUnique({
          where: { email: order.customer_email },
        });
        if (userByEmail) targetUserId = userByEmail.id;
      }

      // Nếu tìm thấy user (hoặc đã có sẵn), cấp quyền học
      if (targetUserId) {
        await tx.userCourse
          .create({
            data: { user_id: targetUserId, course_id: order.course_id },
          })
          .catch(() => console.log(`User ${targetUserId} đã sở hữu khóa học này`));
      }
    });

    // C. GỬI EMAIL (Chỉ gửi khi Transaction thành công)
    try {
      const driveLink = order.course.drive_folder_url || "#";

      await resend.emails.send({
        // LƯU Ý: Nếu chưa verify domain trên Resend, CHỈ GỬI ĐƯỢC VỀ CHÍNH EMAIL CỦA BẠN (onboarding@resend.dev)
        // Khi lên production nhớ verify domain
        from: "Course Support <onboarding@resend.dev>",
        to: order.customer_email,
        subject: `[Xác nhận] Đơn hàng #${order.code} thành công!`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.5;">
                <h1>Cảm ơn bạn ${order.customer_name}!</h1>
                <p>Thanh toán cho khóa học <strong>${order.course.title}</strong> đã được xác nhận.</p>
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <h3>👇 Tài liệu học tập của bạn:</h3>
                <p>
                  <a href="${driveLink}" target="_blank" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Mở Google Drive Folder
                  </a>
                </p>
                <p>Chúc bạn học tốt!</p>
            </div>
          `,
      });
      console.log("📧 Đã gửi mail thành công cho:", order.customer_email);
    } catch (emailError) {
      console.error("❌ Lỗi gửi mail:", emailError);
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Approve Error:", error);
    return { success: false, error: "Lỗi duyệt đơn" };
  }
}

// =========================================================
// 3. HÀM XỬ LÝ WEBHOOK (Được gọi từ route.ts)
// =========================================================
export async function approveOrderByCode(orderCode: string | number, paidAmount: number) {
  try {
    // Convert orderCode sang String để tìm trong DB (vì Prisma field code là String)
    const codeString = String(orderCode);
    console.log(`🤖 Bot đang xử lý đơn: ${codeString} - Số tiền: ${paidAmount}`);

    // 1. Tìm đơn hàng
    const order = await prisma.order.findUnique({
      where: { code: codeString },
      include: { course: true },
    });

    if (!order) {
      console.log("❌ Không tìm thấy đơn hàng:", codeString);
      return { success: false, error: "Not found" };
    }

    // 2. Kiểm tra số tiền
    if (paidAmount < Number(order.amount)) {
      console.log("❌ Chuyển thiếu tiền. Cần:", order.amount, "Nhận:", paidAmount);
      return { success: false, error: "Not enough money" };
    }

    // 3. Kiểm tra nếu đã duyệt rồi thì thôi
    if (order.status === "SUCCESS") {
      console.log("⚠️ Đơn này đã hoàn thành trước đó.");
      return { success: true };
    }

    // 4. Gọi hàm duyệt (Tái sử dụng logic trên)
    return await approveOrder(order.id);
  } catch (error) {
    console.error("Webhook Logic Error:", error);
    return { success: false, error: "Internal Error" };
  }
}
