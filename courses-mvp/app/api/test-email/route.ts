import { NextResponse } from "next/server";
import { Resend } from "resend";

// Khởi tạo Resend với API Key từ file .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    console.log("📧 Bắt đầu test gửi mail...");

    const data = await resend.emails.send({
      // QUAN TRỌNG:
      // Nếu chưa verify domain, BẮT BUỘC phải dùng 'onboarding@resend.dev'
      from: "Test System <onboarding@resend.dev>",

      // Nếu chưa verify domain, CHỈ được gửi về email đăng ký tài khoản Resend của bạn
      to: "germax584@gmail.com", // <-- Đổi thành email của bạn nếu cần

      subject: "Test Mail từ Next.js App",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h1 style="color: #0070f3;">Xin chào! 👋</h1>
            <p>Đây là email kiểm tra hệ thống.</p>
            <p>Nếu bạn nhận được email này nghĩa là cấu hình <b>Resend API Key</b> đã chính xác.</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Gửi lúc: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Kết quả từ Resend:", data);

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("❌ Lỗi code:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
