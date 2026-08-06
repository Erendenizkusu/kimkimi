import {
  getQuestion,
  removeQuestion,
  updateQuestion,
  updateQuestionSchema,
} from '@/lib/server/admin';
import { requireAdmin } from '@/lib/server/auth';
import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export function GET(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return getQuestion(params.id);
  });
}

export function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return updateQuestion(params.id, await parseBody(req, updateQuestionSchema));
  });
}

export function DELETE(req: Request, { params }: Ctx) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return removeQuestion(params.id);
  });
}

export function OPTIONS() {
  return preflight();
}
