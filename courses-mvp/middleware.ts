import { auth } from "@/auth/auth"; // Import đúng đường dẫn file auth của bạn
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role; // Lấy role từ token
  const { nextUrl } = req;

  // --- LUẬT BẢO VỆ ---

  // 1. Nếu truy cập trang Admin
  if (nextUrl.pathname.startsWith("/admin")) {
    // Chưa đăng nhập -> Đá về Login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // Đã đăng nhập nhưng Role không phải ADMIN -> Đá về trang chủ
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // 2. Nếu đã đăng nhập mà cố vào trang Login/Register -> Đá về trang chủ
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// Cấu hình các đường dẫn Middleware cần chạy qua
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
