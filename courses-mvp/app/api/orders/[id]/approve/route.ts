import { NextResponse } from "next/server";
// import { sendEmailHelper } from '@/lib/mail'; // Hàm gửi mail tách riêng

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;

  try {
    // 1. Cập nhật trạng thái đơn hàng trong DB -> PAID
    // const updatedOrder = await db.order.update(...)

    // 2. Lấy link drive của khóa học tương ứng
    const driveLink = "https://drive.google.com/file/d/xxxxx/view";

    // 3. Gọi API gửi mail (hoặc gọi hàm trực tiếp)
    // Giả lập gọi API nội bộ:
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/email/send`, {
      method: "POST",
      body: JSON.stringify({
        to: "user@example.com", // Email người mua lấy từ DB
        subject: "Khóa học của bạn đã được kích hoạt",
        text: `Cảm ơn bạn. Đây là link tài liệu: ${driveLink}`,
      }),
    });

    return NextResponse.json({ message: "Order approved and email sent" });
  } catch (error) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
