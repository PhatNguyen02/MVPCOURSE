"use client";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
            Course<span className="text-blue-600">Master</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Khóa học
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Admin Login
            </Link>
            <Link href="/" className="font-bold">
              MyCourse
            </Link>

            <div>
              {session ? (
                <div className="flex gap-4 items-center">
                  <span>Chào, {session.user?.name}</span>
                  <button onClick={() => signOut()} className="text-red-500 hover:underline">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Đăng nhập Google
                </button>
              )}
            </div>

            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
