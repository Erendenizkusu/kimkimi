import { handle, parseBody, preflight } from '@/lib/server/http';
import { createRoom, createRoomSchema } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(req: Request) {
  return handle(async () => createRoom(await parseBody(req, createRoomSchema)));
}

export function OPTIONS() {
  return preflight();
}
