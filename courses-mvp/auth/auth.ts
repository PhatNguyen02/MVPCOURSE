import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // 1. BẮT BUỘC: Chuyển sang chiến lược JWT để Middleware đọc được dữ liệu
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // 👇 THÊM DÒNG NÀY ĐỂ SỬA LỖI
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // 2. Khi đăng nhập thành công -> Nhét role từ User vào Token
    async jwt({ token, user }) {
      if (user) {
        // user lấy từ DB lên, ép kiểu any để lấy role
        token.role = (user as any).role;
      }
      return token;
    },
    // 3. Chuyển role từ Token sang Session (để dùng trong Client/Server Component)
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as any).role = token.role; // Gán role vào session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
