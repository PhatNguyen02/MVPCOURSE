// // File: components/public/CheckoutModal.tsx
// "use client";
// import React from "react";
// import { X, Upload, Copy, CheckCircle2 } from "lucide-react";

// interface CheckoutModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   price: string;
// }

// const CheckoutModal = ({ isOpen, onClose, price }: CheckoutModalProps) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//           <h2 className="text-lg font-bold text-gray-900">Thanh toán khóa học</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
//           <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30">
//             <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm border border-gray-100">
//               <span className="text-xs text-gray-400 font-medium text-center px-2">QR CODE</span>
//             </div>
//             <p className="font-bold text-lg text-blue-700">Giá: {price}</p>
//             <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
//               <span>MB Bank - 0000123456</span>
//               <button className="text-blue-600">
//                 <Copy className="w-3 h-3" />
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Họ và tên"
//               className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
//             />
//             <input
//               type="email"
//               placeholder="Email nhận khóa học"
//               className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
//             />

//             <div className="relative group cursor-pointer">
//               <input
//                 type="file"
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//               />
//               <div className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50">
//                 <Upload className="w-5 h-5 text-gray-500 mb-2" />
//                 <span className="text-sm font-medium text-gray-600">Tải ảnh biên lai</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
//           <button className="w-full py-3.5 px-4 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2">
//             <CheckCircle2 className="w-4 h-4" /> Xác nhận đã chuyển khoản
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutModal;
