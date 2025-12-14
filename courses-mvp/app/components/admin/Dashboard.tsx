"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, Users, CreditCard, FolderOpen } from "lucide-react"; // Đổi sang lucide-react cho chuẩn

// Định nghĩa kiểu dữ liệu Props nhận từ Server
interface DashboardProps {
  stats: {
    totalRevenue: number;
    totalStudents: number;
    totalCourses: number;
  };
  chartData: any[];
  topCourses: any[];
}

const Card = ({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: any;
}) => (
  <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </div>
      <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
      </span>
    </div>
    <h3 className="text-gray-500 text-xs font-medium tracking-wide uppercase mb-1">{title}</h3>
    <div className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</div>
    <p className="text-xs text-gray-400 mt-2 font-light">{sub}</p>
  </div>
);

const DashboardView: React.FC<DashboardProps> = ({ stats, chartData, topCourses }) => {
  // Format tiền tệ
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-light tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 font-light">
          Overview of your course performance and revenue.
        </p>
      </div>

      {/* Grid Cards - Dùng dữ liệu thật từ stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          sub="+$14,000 this week"
          icon={CreditCard}
        />
        <Card
          title="Active Students"
          value={stats.totalStudents.toLocaleString()}
          sub="+120 new enrollments"
          icon={Users}
        />
        <Card
          title="Total Courses"
          value={stats.totalCourses.toString()}
          sub="Active courses"
          icon={FolderOpen}
        />
        <Card title="Conversion Rate" value="3.2%" sub="+0.4% optimization" icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-medium text-gray-800">Revenue Trends</h2>
            <select className="text-xs bg-transparent border-none text-gray-500 focus:ring-0 cursor-pointer hover:text-gray-900">
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#1f2937", fontSize: "12px", fontWeight: 500 }}
                  cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Courses List - Dùng dữ liệu thật từ topCourses */}
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Top Performing Courses</h2>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {topCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer group"
              >
                <img
                  src={course.thumbnail_url || "https://placehold.co/100"}
                  alt={course.title}
                  className="w-12 h-8 object-cover rounded shadow-sm opacity-90 group-hover:opacity-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{course.title}</h4>
                  <p className="text-[10px] text-gray-500">{course.students} Students</p>
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  {formatCurrency(course.price)}
                </div>
              </div>
            ))}

            {topCourses.length === 0 && (
              <p className="text-xs text-center text-gray-400 py-4">Chưa có khóa học nào</p>
            )}
          </div>
          <button className="mt-4 w-full py-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            View All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
