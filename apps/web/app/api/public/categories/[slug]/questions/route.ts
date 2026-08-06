import { QuestionPhase } from '@prisma/client';

import { badRequest, handle, preflight } from '@/lib/server/http';
import { listQuestions } from '@/lib/server/public';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(req: Request, { params }: { params: { slug: string } }) {
  return handle(() => {
    const url = new URL(req.url);
    const rawPhase = url.searchParams.get('phase');
    if (rawPhase && rawPhase !== QuestionPhase.profile && rawPhase !== QuestionPhase.game) {
      throw badRequest(`Geçersiz phase: ${rawPhase}`);
    }
    const secretId = url.searchParams.get('secretId') ?? undefined;
    return listQuestions(params.slug, (rawPhase as QuestionPhase | null) ?? undefined, secretId);
  });
}

export function OPTIONS() {
  return preflight();
}
