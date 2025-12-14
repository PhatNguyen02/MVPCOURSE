This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
my-course-web/
├── 📁 app/ <-- TRÁI TIM CỦA DỰ ÁN (Routing & Pages)
│ ├── (admin)/ <-- Nhóm trang Admin (URL không hiện chữ admin nếu không muốn)
│ │ ├── dashboard/ <-- URL: /admin/dashboard
│ │ ├── courses/ <-- URL: /admin/courses
│ │ └── layout.tsx <-- Layout chung cho admin (có Sidebar)
│ ├── (public)/ <-- Nhóm trang Khách (Web bán hàng)
│ │ └── about/ <-- URL: /about
│ ├── api/ <-- BACKEND (REST API)
│ │ ├── courses/ <-- API: /api/courses
│ │ └── upload/ <-- API: /api/upload
│ ├── courses/ <-- Dynamic Route
│ │ └── [id]/ <-- URL: /courses/1, /courses/abc
│ ├── globals.css <-- CSS toàn cục
│ ├── layout.tsx <-- Layout gốc (chứa html, body)
│ └── page.tsx <-- Trang chủ (Home)
│
├── 📁 components/ <-- VIÊN GẠCH XÂY GIAO DIỆN (UI Only)
│ ├── admin/ <-- Component chỉ dùng cho Admin (Biểu đồ, Bảng)
│ ├── public/ <-- Component chỉ dùng cho Khách (Navbar, Banner)
│ └── ui/ <-- Component nhỏ dùng chung (Button, Input - ShadCN)
│
├── 📁 lib/ <-- KHO CÔNG CỤ & HẬU CẦN (Logic, Config)
│ ├── db.ts <-- Kết nối Database (Prisma)
│ ├── utils.ts <-- Hàm tiện ích (xử lý chuỗi, classnames)
│ ├── constants.ts <-- Dữ liệu giả, hằng số
│ └── types.ts <-- Định nghĩa kiểu dữ liệu (TypeScript)
│
├── 📁 public/ <-- KHO TÀI NGUYÊN TĨNH
│ ├── images/ <-- Ảnh logo, banner
│ └── icons/ <-- Favicon
│
├── 📁 prisma/ <-- QUẢN LÝ DATABASE
│ └── schema.prisma <-- Nơi thiết kế bảng (User, Course, Order...)
│
├── .env <-- BIẾN MÔI TRƯỜNG (Mật khẩu DB, API Key)
├── next.config.mjs <-- Cấu hình Next.js
├── tailwind.config.ts <-- Cấu hình màu sắc, font chữ
└── tsconfig.json <-- Cấu hình TypeScript
