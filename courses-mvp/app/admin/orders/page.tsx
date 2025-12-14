import { prisma } from "@/lib/prisma";
import { approveOrder } from "../../actions/orders";
import { Check, Clock, XCircle, Search } from "lucide-react";
import Image from "next/image";

export default async function AdminOrdersPage() {
  // Lấy đơn hàng mới nhất
  const orders = await prisma.order.findMany({
    orderBy: { created_at: "desc" },
    include: { course: true },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500">Danh sách các giao dịch mua khóa học</p>
        </div>
        <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400 ml-1" />
          <input placeholder="Tìm mã đơn..." className="text-sm outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Mã đơn / Ngày</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Khóa học</th>
              <th className="px-6 py-4">Thực thu</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-blue-600">{order.code}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.customer_name}</div>
                  <div className="text-gray-500 text-xs">{order.customer_email}</div>
                </td>
                <td className="px-6 py-4 max-w-[200px] truncate" title={order.course.title}>
                  {order.course.title}
                </td>
                <td className="px-6 py-4 font-mono font-medium text-gray-700">
                  {new Intl.NumberFormat("vi-VN").format(Number(order.amount))} đ
                </td>
                <td className="px-6 py-4">
                  {order.status === "SUCCESS" ? (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-100">
                      <Check className="w-3 h-3" /> Đã thanh toán
                    </span>
                  ) : order.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-yellow-100">
                      <Clock className="w-3 h-3" /> Chờ duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <XCircle className="w-3 h-3" /> Đã hủy
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {order.status === "PENDING" && (
                    <form
                      action={async () => {
                        "use server";
                        await approveOrder(order.id);
                      }}
                    >
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow">
                        Xác nhận tiền về
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
