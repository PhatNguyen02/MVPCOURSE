import { NextResponse } from "next/server";

// 👇 Sửa dòng này
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Định nghĩa kiểu đúng: params là một Promise
) {
  // 👇 2. Phải await params trước khi lấy dữ liệu
  const { id } = await params;
  const orderId = id;

  try {
    // 1. Cập nhật trạng thái đơn hàng trong DB -> PAID
    // const updatedOrder = await db.order.update(...)

    // 2. Lấy link drive của khóa học tương ứng
    const driveLink = "https://drive.google.com/file/d/xxxxx/view";

    // 3. Gọi API gửi mail
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Lưu ý: Nếu gửi từ Server-to-Server, tốt nhất nên gọi hàm gửi mail trực tiếp (import sendEmail function)
    // thay vì fetch lại chính API của mình để tránh delay mạng.
    await fetch(`${baseUrl}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "user@example.com",
        subject: "Khóa học của bạn đã được kích hoạt",
        text: `Cảm ơn bạn. Đây là link tài liệu: ${driveLink}`,
      }),
    });

    return NextResponse.json({ message: "Order approved and email sent" });
  } catch (error) {
    console.error("Error:", error); // Nên log lỗi ra để debug trên Vercel
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
