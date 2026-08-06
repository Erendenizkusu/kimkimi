import { createQuestion, createQuestionSchema, listQuestionsByCategory } from '@/lib/server/admin';
import { requireAdmin } from '@/lib/server/auth';
import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    const categoryId = new URL(req.url).searchParams.get('categoryId');
    return listQuestionsByCategory(categoryId);
  });
}

export function POST(req: Request) {
  return handle(async () => {
    await requireAdmin(bearerToken(req));
    return createQuestion(await parseBody(req, createQuestionSchema));
  });
}

export function OPTIONS() {
  return preflight();
}
