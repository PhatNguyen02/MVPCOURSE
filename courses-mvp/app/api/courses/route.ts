import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     // 1. Hứng tất cả dữ liệu từ Frontend gửi lên
//     const body = await req.json();
//     const { title, price, driveLink, thumbnail, status } = body;

//     // Validate cơ bản
//     if (!title) {
//       return new NextResponse("Title is missing", { status: 400 });
//     }

//     // 2. Xử lý dữ liệu trước khi lưu
//     // Chuyển đổi trạng thái từ chuỗi "Published"/"Draft" sang Boolean
//     const isPublished = status === "Published";

//     // Chuyển đổi giá từ chuỗi sang số (Decimal)
//     const priceDecimal = price ? parseFloat(price) : 0;

//     // 3. Lưu vào Database (Map đúng tên trường trong Schema)
//     const course = await prisma.course.create({
//       data: {
//         title,
//         price: priceDecimal, // Map vào cột price
//         drive_folder_url: driveLink, // Map 'driveLink' của form vào cột 'drive_folder_url'
//         thumbnail_url: thumbnail, // Map 'thumbnail' của form vào cột 'thumbnail_url'
//         is_published: isPublished, // Map 'status' vào cột 'is_published'

//         // userId: Chưa có auth nên tạm bỏ qua
//       },
//     });

//     return NextResponse.json(course);
//   } catch (error) {
//     console.log("[COURSES_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// Hàm GET: Lấy toàn bộ khóa học từ DB
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        created_at: "desc", // Sắp xếp cái mới nhất lên đầu
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.log("[COURSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
