import { handle, preflight } from '@/lib/server/http';
import { listCategories } from '@/lib/server/public';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return handle(() => listCategories());
}

export function OPTIONS() {
  return preflight();
}
