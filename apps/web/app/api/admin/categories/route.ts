import { createCategory, createCategorySchema, listCategories } from '@/lib/server/admin';
import { requireAdmin } from '@/lib/server/auth';
import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return listCategories();
  });
}

export function POST(req: Request) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return createCategory(await parseBody(req, createCategorySchema));
  });
}

export function OPTIONS() {
  return preflight();
}
