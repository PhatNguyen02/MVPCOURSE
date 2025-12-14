"use client";
import React, { useState } from "react";
import { MOCK_ORDERS } from "../../../lib/constants";
import { OrderStatus } from "../../../lib/types";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "./Icons";

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.NEW:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
          New
        </span>
      );
    case OrderStatus.PAYMENT_VERIFY:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          <Clock className="w-3 h-3 mr-1.5" />
          Verify
        </span>
      );
    case OrderStatus.ACCESS_SENT:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>
          Access Sent
        </span>
      );
    case OrderStatus.COMPLETED:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="w-3 h-3 mr-1.5" />
          Paid
        </span>
      );
    case OrderStatus.CANCELLED:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
          <XCircle className="w-3 h-3 mr-1.5" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};

const OrderList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState(MOCK_ORDERS);

  // Filter logic
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (orderId: string) => {
    // Simulate server action
    console.log(`Approving order ${orderId}...`);
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: OrderStatus.ACCESS_SENT } : o))
    );
    // In real app, triggering a toast here: "Payment approved, link sent!"
    alert("Payment Approved! Access link sent to customer.");
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-light tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 font-light">
            Manage customer purchases and approve manual payments.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white/40 p-1.5 rounded-xl border border-gray-200/50 backdrop-blur-sm">
        <div className="flex-1 flex items-center px-3 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, customer, or email..."
            className="w-full py-2 pl-3 text-sm bg-transparent border-none focus:outline-none placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
          <Filter className="w-3.5 h-3.5 mr-2" />
          Status
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/60 bg-gray-50/30">
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-white transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-900 font-mono">
                      {order.orderCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.customerAvatar}
                        alt=""
                        className="w-8 h-8 rounded-full bg-gray-100"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-gray-500">{order.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{order.courseTitle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ${order.amount.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-gray-400">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2  transition-opacity">
                      {order.status === OrderStatus.PAYMENT_VERIFY && (
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="flex items-center px-2 py-1 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
                          title="Approve Payment"
                        >
                          Approve
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
