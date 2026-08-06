import { login, loginSchema } from '@/lib/server/auth';
import { handle, parseBody, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(req: Request) {
  return handle(async () => login(await parseBody(req, loginSchema)));
}

export function OPTIONS() {
  return preflight();
}
