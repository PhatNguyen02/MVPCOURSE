import { OrderStatus } from "./types";

export const MOCK_COURSES = [
  {
    id: "1",
    title: "Next.js 14 Full Course",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    status: "Published",
    driveLink: "drive.google.com/folders/123...",
    students: 1205,
    price: 99,
  },
  {
    id: "2",
    title: "React Native Masterclass",
    thumbnail:
      "https://images.unsplash.com/photo-1618477247222-ac591245363d?w=800&auto=format&fit=crop&q=60",
    status: "Draft",
    driveLink: "",
    students: 0,
    price: 129,
  },
  {
    id: "3",
    title: "UI/UX Design Systems",
    thumbnail:
      "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&auto=format&fit=crop&q=60",
    status: "Published",
    driveLink: "drive.google.com/folders/xyz...",
    students: 850,
    price: 79,
  },
];

export const CHART_DATA = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 2000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

export const MOCK_ORDERS = [
  {
    id: "ORD-001",
    orderCode: "#2029",
    customerName: "Alex Johnson",
    customerEmail: "alex@example.com",
    customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    courseTitle: "Next.js 14 Full Course",
    date: "Oct 24, 2023",
    amount: 99.0,
    paymentMethod: "Bank Transfer",
    status: OrderStatus.PAYMENT_VERIFY,
  },
  {
    id: "ORD-002",
    orderCode: "#2030",
    customerName: "Sarah Smith",
    customerEmail: "sarah@example.com",
    customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    courseTitle: "UI/UX Design Systems",
    date: "Oct 24, 2023",
    amount: 79.0,
    paymentMethod: "Credit Card",
    status: OrderStatus.COMPLETED,
  },
];

export const INITIAL_PIPELINE = [
  {
    id: "item-1",
    title: "Order-2029",
    subtitle: "Next.js Course",
    amount: "$99.00",
    date: "2h ago",
    status: OrderStatus.PAYMENT_VERIFY,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "item-2",
    title: "Order-2030",
    subtitle: "UI Design",
    amount: "$79.00",
    date: "5h ago",
    status: OrderStatus.COMPLETED,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
];
