import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';
import { gameAnswerSchema, submitGameAnswer } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(req: Request, { params }: { params: { secretId: string } }) {
  return handle(async () =>
    submitGameAnswer(params.secretId, bearerToken(req), await parseBody(req, gameAnswerSchema)),
  );
}

export function OPTIONS() {
  return preflight();
}
