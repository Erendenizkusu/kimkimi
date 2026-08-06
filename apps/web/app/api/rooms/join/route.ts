import { handle, parseBody, preflight } from '@/lib/server/http';
import { joinRoom, joinRoomSchema } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function POST(req: Request) {
  return handle(async () => joinRoom(await parseBody(req, joinRoomSchema)));
}

export function OPTIONS() {
  return preflight();
}
