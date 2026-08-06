import { json, preflight } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** DB'siz canlılık ucu — izleme/uptime kontrolleri için. */
export function GET() {
  return json({ status: 'ok' });
}

export function OPTIONS() {
  return preflight();
}
