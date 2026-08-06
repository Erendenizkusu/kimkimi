import { bearerToken, handle, preflight } from '@/lib/server/http';
import { getPublicRoomState, resolvePlayer } from '@/lib/server/rooms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Oyun senkronizasyonunun kalbi — istemciler bunu düzenli aralıkla çağırır
 * (eski socket.io `room_state` yayınının yerine geçti).
 */
export function GET(req: Request, { params }: { params: { secretId: string } }) {
  return handle(async () => {
    await resolvePlayer(params.secretId, bearerToken(req));
    return getPublicRoomState(params.secretId);
  });
}

export function OPTIONS() {
  return preflight();
}
