import { handle, preflight } from '@/lib/server/http';
import { prisma } from '@/lib/server/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return handle(async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', db: true };
  });
}

export function OPTIONS() {
  return preflight();
}
