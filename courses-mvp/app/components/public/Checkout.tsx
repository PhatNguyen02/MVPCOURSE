"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions/orders"; // Đảm bảo import đúng đường dẫn
import toast from "react-hot-toast";

interface CheckoutModalProps {
  course: { id: string; title: string; price: number };
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ course, isOpen, onClose }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({ name: "", email: "" });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Đang kết nối cổng thanh toán...");

    try {
      // Gọi Server Action
      const res = await createOrder(course.id, course.price, info.email, info.name);

      if (res.success && res.checkoutUrl) {
        toast.success("Đang chuyển hướng...", { id: toastId });

        // --- QUAN TRỌNG: CHUYỂN HƯỚNG SANG PAYOS ---
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("Lỗi: " + res.error, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.", { id: toastId });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/80">
          <h3 className="font-bold text-gray-800">Thông tin thanh toán</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form điền thông tin */}
        <form onSubmit={handleCreateOrder} className="p-6 space-y-5">
          {/* Tóm tắt đơn hàng */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-1">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              Bạn đang mua khóa học
            </p>
            <p className="font-bold text-gray-900 text-lg line-clamp-1">{course.title}</p>
            <p className="text-xl font-bold text-blue-600">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                course.price
              )}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
              <input
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="VD: Nguyễn Văn A"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email nhận tài liệu
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="email@example.com"
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Tiếp tục thanh toán qua PayOS"
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            Bạn sẽ được chuyển hướng đến cổng thanh toán an toàn.
          </p>
        </form>
      </div>
    </div>
  );
};
