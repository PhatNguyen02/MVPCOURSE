import Link from "next/link";
import { CheckCircle, XCircle, Home, ArrowRight } from "lucide-react";

// 1. Định nghĩa lại Type cho searchParams là Promise
interface Props {
  searchParams: Promise<{
    code?: string;
    orderCode?: string;
    status?: string;
    cancel?: string;
  }>;
}

// 2. Thêm từ khóa 'async' vào function component
export default async function PaymentSuccessPage({ searchParams }: Props) {
  // 3. QUAN TRỌNG: Phải 'await' searchParams trước khi dùng
  const params = await searchParams;

  // 4. Dùng biến 'params' đã await để lấy dữ liệu
  const isSuccess = params.code === "00" || params.status === "PAID";
  const isCancel = params.cancel === "true" || params.status === "CANCELLED";
  const orderCode = params.orderCode;

  // --- TRƯỜNG HỢP 1: KHÁCH HỦY / LỖI ---
  if (isCancel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-50 p-4 rounded-full">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
          <p className="text-gray-500 mb-8">
            Giao dịch đã bị hủy hoặc gặp sự cố. Bạn vui lòng thử lại sau nhé.
          </p>

          <Link href="/" className="block w-full">
            <button className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Quay về trang chủ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 2: THÀNH CÔNG ---
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thanh toán thành công!</h1>

          <p className="text-gray-500 mb-6">
            Đơn hàng <span className="font-bold text-gray-800">#{orderCode}</span> đã được xác nhận.
          </p>

          <div className="bg-gray-50 p-4 rounded-xl mb-8 text-sm text-gray-600 border border-gray-200 text-left">
            <p>📧 Hệ thống đã gửi link khóa học qua email cho bạn.</p>
            <p className="mt-1">
              👉 Nếu không thấy, vui lòng kiểm tra cả mục <b>Spam/Rác</b> nhé.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/my-courses" className="block w-full">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                Vào học ngay <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <Link href="/" className="block w-full">
              <button className="w-full text-gray-500 hover:text-gray-900 font-medium py-2 transition-colors">
                Quay về trang chủ
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Fallback ---
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-medium text-gray-600 mb-4">
          Không tìm thấy thông tin giao dịch
        </h1>
        <p className="text-sm text-gray-400">Debug: {JSON.stringify(params)}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 block">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
