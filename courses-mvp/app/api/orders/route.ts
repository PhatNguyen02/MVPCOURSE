import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { courseId, userEmail, amount } = await request.json();

    // Logic tạo order trong DB với trạng thái PENDING
    // const order = await db.order.create(...)

    // Trả về mã QR hoặc thông tin chuyển khoản giả lập
    return NextResponse.json({
      orderId: "ORDER_123",
      status: "PENDING",
      paymentInfo: "VietQR...",
    });
  } catch (error) {
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
