const KEY = 'kimkimi_room_session';

export type RoomSession = {
  secretId: string;
  playerToken: string;
  shortCode: string;
  isHost: boolean;
};

export function saveRoomSession(s: RoomSession) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function loadRoomSession(): RoomSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RoomSession;
  } catch {
    return null;
  }
}

export function clearRoomSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
