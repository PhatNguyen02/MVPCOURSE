import { prisma } from "@/lib/prisma";
import CategoryListClient from "../../components/admin/Category";

export const dynamic = "force-dynamic"; // Bắt buộc load mới mỗi lần vào

export default async function CategoryPage() {
  // 1. Lấy dữ liệu từ DB
  const rawCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // 2. Serialize dữ liệu (Chuyển Date -> String để tránh lỗi Next.js)
  const categories = rawCategories.map((cat) => ({
    ...cat,
    // Nếu ID của bạn là BigInt hoặc dạng lạ, hãy convert sang string: id: cat.id.toString(),
    created_at: cat.created_at.toISOString(), // 👈 Quan trọng: Chuyển Date thành String
    updated_at: cat.updated_at.toISOString(),
    _count: {
      courses: cat._count.courses, // Giữ nguyên số lượng
    },
  }));

  // 3. Truyền xuống Client Component
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CategoryListClient initialCategories={categories} />
    </div>
  );
}
