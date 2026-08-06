import { bearerToken, handle, preflight } from '@/lib/server/http';
import { getResults } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(req: Request, { params }: { params: { secretId: string } }) {
  return handle(() => getResults(params.secretId, bearerToken(req)));
}

export function OPTIONS() {
  return preflight();
}
