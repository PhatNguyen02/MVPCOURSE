"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Cần cài: npm i use-debounce

interface Category {
  id: string;
  name: string;
}

export default function CourseFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy giá trị hiện tại từ URL
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("categoryId") || "";

  // Hàm update URL chung
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset về trang 1 mỗi khi filter thay đổi
    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/courses?${params.toString()}`, { scroll: false });
  };

  // Debounce việc search để không reload liên tục khi gõ
  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams("search", term);
  }, 300);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Ô tìm kiếm */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm khóa học..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Dropdown danh mục */}
      <div className="w-full md:w-64">
        <select
          value={currentCategory}
          onChange={(e) => updateParams("categoryId", e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
