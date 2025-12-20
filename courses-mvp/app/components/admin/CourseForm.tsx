"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // 👈 Import bình thường
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Type,
  DollarSign,
  FolderOpen,
  Image,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
} from "lucide-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/app/actions/course";
import toast from "react-hot-toast";

// --- Types ---
interface CategoryOption {
  id: string | number;
  name: string;
}

interface CourseData {
  id?: string;
  title: string;
  slug: string;
  price: number;
  drive_folder_url: string;
  thumbnail_url: string;
  is_published: boolean;
  description?: string;
  category_id?: string | number | null;
}

// --- Schema ---
const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  slug: z.string().optional(),
  price: z.coerce.number().min(0, "Giá tiền không được âm"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  driveLink: z.string().min(1, "Link Drive là bắt buộc"),
  thumbnail: z.string().min(1, "Link ảnh là bắt buộc"),
  status: z.enum(["Draft", "Published"]),
  description: z.string().optional(),
});

// Tạo type từ schema để dùng cho hàm onSubmit
type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CourseData | null;
  categories: CategoryOption[];
}

// --- Component ---
export const CourseForm = ({
  isOpen,
  onClose,
  initialData,
  categories = [], // Giá trị mặc định để tránh crash
}: CourseFormProps) => {
  const router = useRouter();

  // 👇 SỬA LỖI TẠI ĐÂY: Xóa <FormValues> đi
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      categoryId: "",
      driveLink: "",
      thumbnail: "",
      status: "Draft",
      description: "",
    },
  });

  const titleValue = watch("title");
  const currentStatus = watch("status");
  const thumbnailValue = watch("thumbnail");

  // Auto slug
  useEffect(() => {
    if (titleValue && !initialData) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, setValue, initialData]);

  // Load Initial Data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          slug: initialData.slug || "",
          price: Number(initialData.price),
          categoryId: initialData.category_id ? String(initialData.category_id) : "",
          driveLink: initialData.drive_folder_url || "",
          thumbnail: initialData.thumbnail_url || "",
          status: initialData.is_published ? "Published" : "Draft",
          description: initialData.description || "",
        });
      } else {
        reset({
          title: "",
          slug: "",
          price: 0,
          categoryId: "",
          driveLink: "",
          thumbnail: "",
          status: "Draft",
          description: "",
        });
      }
    }
  }, [initialData, isOpen, reset]);

  // Submit Handler: Giữ nguyên type FormValues ở đây là chuẩn
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const loadingToast = toast.loading("Đang xử lý...");

      const payload = {
        title: data.title,
        price: data.price,
        drive_folder_url: data.driveLink,
        thumbnail_url: data.thumbnail,
        is_published: data.status === "Published",
        description: data.description,
        slug: data.slug,
        category_id: data.categoryId,
      };

      let res;
      if (initialData?.id) {
        res = await updateCourse(initialData.id, payload);
      } else {
        res = await createCourse(payload);
      }

      toast.dismiss(loadingToast);

      if (res.success) {
        toast.success("Thành công!");
        onClose();
        router.refresh();
      } else {
        toast.error("Lỗi: " + res.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Có lỗi xảy ra.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            {initialData ? "Sửa khóa học" : "Tạo khóa học mới"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-medium block mb-1">Tên khóa học</label>
            <input {...register("title")} className="w-full border rounded-lg px-3 py-2 text-sm" />
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title.message as string}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Combobox */}
            <div>
              <label className="text-xs font-medium block mb-1">Danh mục</label>
              <select
                {...register("categoryId")}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">-- Chọn danh mục --</option>
                {/* Dùng optional chaining ?. để an toàn hơn */}
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-red-500 text-xs">{errors.categoryId.message as string}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <div className="flex bg-gray-100 p-1 rounded-lg select-none">
                {["Draft", "Published"].map((status) => (
                  <button
                    key={status}
                    type="button" // 👈 Bắt buộc phải có để không bị submit form nhầm
                    onClick={() => {
                      // Cập nhật giá trị vào form thủ công
                      setValue("status", status as "Draft" | "Published", {
                        shouldValidate: true, // Kiểm tra lỗi ngay lập tức
                        shouldDirty: true, // Đánh dấu form đã bị thay đổi
                      });
                    }}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${
                      currentStatus === status // 👈 Dùng biến currentStatus đã watch ở trên
                        ? "bg-white text-gray-900 shadow-sm font-semibold"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    {status === "Draft" ? "Bản nháp" : "Công khai"}
                  </button>
                ))}
              </div>
              {/* Input ẩn để hứng lỗi validation nếu cần */}
              <input type="hidden" {...register("status")} />
            </div>
            {/* Price */}
            <div>
              <label className="w-full text-xs font-medium block mb-1">Giá (VND)</label>
              <input
                type="number"
                {...register("price")}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              {errors.price && (
                <span className="text-red-500 text-xs">{errors.price.message as string}</span>
              )}
            </div>
          </div>

          {/* Drive & Thumbnail */}
          <div>
            <label className="text-xs font-medium block mb-1">Link Google Drive</label>
            <input
              {...register("driveLink")}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            {errors.driveLink && (
              <span className="text-red-500 text-xs">{errors.driveLink.message as string}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Link Thumbnail</label>
            <input
              {...register("thumbnail")}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            {errors.thumbnail && (
              <span className="text-red-500 text-xs">{errors.thumbnail.message as string}</span>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border rounded text-sm">
            Hủy
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded text-sm flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />} Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
