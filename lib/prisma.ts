import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined; // Add undefined to the type
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(); // Use nullish coalescing

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
