// "use client";

// import React, { useState } from "react";
// import { X, Upload, Copy, CheckCircle2 } from "lucide-react";

// interface CheckoutModalProps {
//   isOpen: boolean; // Trạng thái mở/đóng
//   onClose: () => void; // Hàm để đóng popup
//   price: string; // Giá tiền truyền vào từ bên ngoài
// }

// const CheckoutModal = ({ isOpen, onClose, price }: CheckoutModalProps) => {
//   // Nếu chưa mở thì không render gì cả
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
//       {/* Lớp nền đen mờ phía sau */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={onClose} // Bấm ra ngoài thì đóng
//       />

//       {/* Nội dung chính của Modal */}
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//           <h2 className="text-lg font-bold text-gray-900">Thanh toán khóa học</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body (Có cuộn dọc nếu màn hình nhỏ) */}
//         <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
//           {/* Khu vực QR Code */}
//           <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
//             <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm border border-gray-100">
//               {/* Chỗ này sau này bạn thay bằng ảnh QR thật */}
//               <span className="text-xs text-gray-400 font-medium text-center px-2">
//                 QR CODE
//                 <br />
//                 NGÂN HÀNG
//               </span>
//             </div>
//             <p className="font-bold text-lg text-blue-700">Chuyển khoản: {price}</p>
//             <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
//               <span>MB Bank - 0000123456 - ADMIN</span>
//               <button className="text-blue-600 hover:text-blue-800" title="Sao chép">
//                 <Copy className="w-3 h-3" />
//               </button>
//             </div>
//           </div>

//           {/* Form điền thông tin */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">Họ và tên</label>
//               <input
//                 type="text"
//                 placeholder="Nguyễn Văn A"
//                 className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Email nhận khóa học
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="email@vidu.com"
//                   className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                   Số điện thoại
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="0912..."
//                   className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
//                 />
//               </div>
//             </div>

//             {/* Mã giao dịch */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1.5">
//                 Nội dung chuyển khoản / Mã GD
//               </label>
//               <input
//                 type="text"
//                 placeholder="Nhập mã giao dịch (VD: FT123456)"
//                 className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
//               />
//             </div>

//             {/* Upload ảnh bằng chứng */}
//             <div className="relative group cursor-pointer">
//               <input
//                 type="file"
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//               />
//               <div className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-all">
//                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
//                   <Upload className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-600">
//                   Tải ảnh biên lai (Bắt buộc)
//                 </span>
//                 <span className="text-xs text-gray-400 mt-1">Hỗ trợ: JPG, PNG</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer: Nút xác nhận */}
//         <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
//           <button className="w-full py-3.5 px-4 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
//             <CheckCircle2 className="w-4 h-4" />
//             Xác nhận đã chuyển khoản
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutModal;
