// // File: components/courses/CourseSidebar.tsx
// "use client";

// import React, { useState } from "react";
// import { PlayCircle, Clock, FileText } from "lucide-react";
// // Nhớ import đúng đường dẫn CheckoutModal của bạn
// import CheckoutModal from "./Checkout";

// interface SidebarProps {
//   course: {
//     id: string;
//     price: number;
//     title: string;
//     thumbnail_url: string | null;
//   };
// }

// export default function CourseSidebar({ course }: SidebarProps) {
//   const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   return (
//     <>
//       <CheckoutModal
//         isOpen={isCheckoutOpen}
//         onClose={() => setIsCheckoutOpen(false)}
//         price={formatPrice(course.price)}
//       />

//       <div className="sticky top-8 space-y-6">
//         <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
//           {/* Ảnh Preview */}
//           <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 group cursor-pointer">
//             <img
//               src={course.thumbnail_url || "https://placehold.co/600x400?text=No+Image"}
//               alt={course.title}
//               className="w-full h-full object-cover opacity-90"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <PlayCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="mb-6">
//               <span className="text-3xl font-extrabold text-gray-900">
//                 {formatPrice(course.price)}
//               </span>
//             </div>

//             <button
//               onClick={() => setIsCheckoutOpen(true)}
//               className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
//             >
//               Mua Ngay
//             </button>

//             <div className="mt-6 space-y-3">
//               <div className="flex items-center gap-3 text-sm text-gray-600">
//                 <Clock className="w-4 h-4 text-gray-400" />
//                 <span>Truy cập trọn đời</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-gray-600">
//                 <FileText className="w-4 h-4 text-gray-400" />
//                 <span>Bao gồm Source Code</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
