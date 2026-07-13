import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const rawUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const url = rawUrl.startsWith("file:")
    ? "file:" + path.resolve(process.cwd(), rawUrl.slice("file:".length))
    : rawUrl;
  const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
