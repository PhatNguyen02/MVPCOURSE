import React from "react";
import { prisma } from "@/lib/prisma";
import DashboardView from "../../components/admin/Dashboard"; // Import component Dashboard đã tạo

export const dynamic = "force-dynamic"; // F5 là có data mới

export default async function DashboardPage() {
  // 1. Lấy danh sách khóa học từ DB (Giới hạn 5 khóa mới nhất làm Top Courses)
  const coursesRaw = await prisma.course.findMany({
    take: 5,
    orderBy: {
      price: "desc", // Tạm thời xếp theo giá (vì chưa có bảng orders đếm số lượng mua)
    },
  });

  // 2. Tính toán các chỉ số thống kê (Giả lập tính toán từ DB)
  // Trong thực tế bạn sẽ query bảng Orders để có con số chính xác
  const totalCourses = await prisma.course.count();

  // Tính tổng giá trị các khóa học đang có (Demo doanh thu tiềm năng)
  const totalValue = coursesRaw.reduce((acc, course) => acc + Number(course.price), 0);

  // 3. Serialize dữ liệu (Chuẩn hóa) để truyền xuống Client
  const topCourses = coursesRaw.map((course) => ({
    id: course.id,
    title: course.title,
    thumbnail_url: course.thumbnail_url,
    price: Number(course.price),
    students: 0, // Placeholder: Vì chưa có bảng orders/user_courses nên tạm để 0
  }));

  // 4. Mock Data cho biểu đồ (Chart Data)
  // Vì chưa có bảng Orders theo thời gian, ta vẫn phải dùng Mock cho Chart này
  // Sau này có bảng Orders, ta sẽ query: prisma.orders.groupBy(...)
  const chartData = [
    { name: "Mon", value: 4000 },
    { name: "Tue", value: 3000 },
    { name: "Wed", value: 2000 },
    { name: "Thu", value: 2780 },
    { name: "Fri", value: 1890 },
    { name: "Sat", value: 2390 },
    { name: "Sun", value: 3490 },
  ];

  const stats = {
    totalRevenue: totalValue * 12, // Giả lập nhân 12 đơn hàng
    totalStudents: 124, // Giả lập
    totalCourses: totalCourses,
  };

  return <DashboardView stats={stats} chartData={chartData} topCourses={topCourses} />;
}
