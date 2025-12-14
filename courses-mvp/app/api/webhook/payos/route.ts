// app/api/webhook/payos/route.ts
import { NextResponse } from "next/server";
// 👇 SỬA LỖI Ở ĐÂY: Thêm dấu ngoặc nhọn { }
import { PayOS } from "@payos/node";
import { approveOrderByCode } from "@/app/actions/payment";
import { config } from "../../../../config/index";

const payOS = new PayOS({
  clientId: config.PAYOS_CLIENT_ID,
  apiKey: config.PAYOS_API_KEY,
  checksumKey: config.PAYOS_CHECKSUM_KEY,
});
export async function POST(req: Request) {
  try {
    console.log("🔥 Webhook PayOS đã được gọi!");
    const body = await req.json();
    console.log("🔥 Webhook đã được gọi!");
    // 👇 SỬA LỖI TẠI ĐÂY: Thêm 'await' trước payOS.webhooks.verify
    const webhookData = payOS.webhooks.verify(body);
    // ❌ Sai: const webhookData = payOS.webhooks.verify(body);
    // ✅ Đúng: const webhookData = await payOS.webhooks.verify(body); (Tuy nhiên, một số bản SDK mới verify là sync, nhưng nếu lỗi báo Promise thì bắt buộc phải await)

    // ĐỂ CHẮC CHẮN NHẤT (VÌ SDK CÓ THỂ THAY ĐỔI), BẠN HÃY VIẾT NHƯ SAU:
    // Nếu nó là Promise thì await, nếu không thì vẫn chạy đúng.
    const verifiedData = await payOS.webhooks.verify(body);

    const { orderCode, amount } = verifiedData;

    console.log("Dữ liệu webhook:", verifiedData); // Log ra để kiểm tra

    // Gọi Action (Ép kiểu string cho chắc chắn)
    await approveOrderByCode(String(orderCode), amount);

    return NextResponse.json({
      error: 0,
      message: "Ok",
      data: verifiedData,
    });
  } catch (error: any) {
    console.error("Lỗi Webhook:", error.message);
    return NextResponse.json(
      {
        error: -1,
        message: error.message,
        data: null,
      },
      { status: 400 }
    );
  }
}
