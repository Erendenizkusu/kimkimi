import {
  getCategory,
  removeCategory,
  updateCategory,
  updateCategorySchema,
} from '@/lib/server/admin';
import { requireAdmin } from '@/lib/server/auth';
import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export function GET(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return getCategory(params.id);
  });
}

export function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return updateCategory(params.id, await parseBody(req, updateCategorySchema));
  });
}

export function DELETE(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return removeCategory(params.id);
  });
}

export function OPTIONS() {
  return preflight();
}
