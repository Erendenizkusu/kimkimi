import { bearerToken, handle, parseBody, preflight } from '@/lib/server/http';
import { profileAnswersSchema, submitProfileAnswers } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(req: Request, { params }: { params: { secretId: string } }) {
  return handle(async () =>
    submitProfileAnswers(
      params.secretId,
      bearerToken(req),
      await parseBody(req, profileAnswersSchema),
    ),
  );
}

export function OPTIONS() {
  return preflight();
}
