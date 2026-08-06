import { PrismaClient } from '@prisma/client';

/**
 * Serverless'ta her istek yeni bir modül örneği yaratabiliyor; global'de
 * saklamazsak sıcak lambda'lar üst üste bağlantı açıp Neon'un havuzunu tüketir.
 */
const globalForPrisma = globalThis as unknown as { kkPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.kkPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.kkPrisma = prisma;
}
