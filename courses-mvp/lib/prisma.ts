// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Bật log để xem câu SQL chạy ngầm (rất tốt để debug)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
