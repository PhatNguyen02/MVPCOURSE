import { auth } from "@/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Danh sách các route công khai (không cần login)
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/courses") ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname === "/login" || // 👈 Cho phép vào Login
    nextUrl.pathname === "/register"; // 👈 Cho phép vào Register

  // 1. Nếu đã Login mà cố vào Login/Register -> Đá về Home
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 2. Nếu chưa Login mà vào trang Admin -> Đá về Login
  if (!isLoggedIn && !isPublicRoute && nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Loại trừ các file tĩnh, ảnh, api public
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
