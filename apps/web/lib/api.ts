import { getApiUrl } from './config';
import type { Category, PublicQuestion } from './types';
import { userFacingApiMessage } from './userFacingErrors';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Tarayıcı düzeyindeki ağ hatalarını (Failed to fetch, CORS, kapalı API vb.)
 * teknik İngilizce yerine okunaklı Türkçe metne çevirir.
 */
export function describeClientFetchError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const m = msg.toLowerCase();
  if (
    e instanceof TypeError &&
    (m.includes('failed to fetch') || m.includes('load failed') || m.includes('networkerror'))
  ) {
    return `Sunucuya ulaşılamıyor (ağ hatası). KimKimi API’nin çalıştığından emin ol. Web uygulaması şu adrese istek atıyor: ${getApiUrl()}. Geliştirmede genelde önce apps/api sunucusunu başlatman gerekir; üretimde .env.local içindeki NEXT_PUBLIC_API_URL değerini kontrol et.`;
  }
  return msg;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 18_000);
  try {
    return await fetch(`${getApiUrl()}${path}`, { ...init, signal: ctrl.signal });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error(
        'İstek zaman aşımına uğradı (18 sn). API yanıt vermiyor olabilir; sunucuyu ve bağlantını kontrol et.',
      );
    }
    throw new Error(describeClientFetchError(e));
  } finally {
    clearTimeout(t);
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const r = await apiFetch('/public/categories');
  if (!r.ok) throw new Error(`Kategoriler alınamadı (${r.status})`);
  return (await r.json()) as Category[];
}

export async function fetchPublicQuestions(
  slug: string,
  phase: 'profile' | 'game',
  secretId?: string,
): Promise<PublicQuestion[]> {
  const q = new URLSearchParams({ phase });
  if (secretId) q.set('secretId', secretId);
  const r = await apiFetch(`/public/categories/${encodeURIComponent(slug)}/questions?${q}`);
  if (!r.ok) throw new Error(`Sorular yüklenemedi (${r.status})`);
  return (await r.json()) as PublicQuestion[];
}

export async function createRoom(categoryId: string, hostDisplayName: string) {
  const r = await apiFetch('/rooms', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ categoryId, hostDisplayName }),
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(userFacingApiMessage(r.status, body || '{}'));
  }
  return (await r.json()) as {
    roomId: string;
    shortCode: string;
    secretId: string;
    hostPlayerToken: string;
    expiresAt: string;
  };
}

export async function joinRoom(shortCode: string, guestDisplayName: string) {
  const r = await apiFetch('/rooms/join', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ shortCode: shortCode.toUpperCase(), guestDisplayName }),
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(userFacingApiMessage(r.status, body || '{}'));
  }
  return (await r.json()) as {
    roomId: string;
    secretId: string;
    guestPlayerToken: string;
    status: string;
  };
}

export async function getRoomState(secretId: string, token: string) {
  const r = await apiFetch(`/rooms/${encodeURIComponent(secretId)}/state`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as Record<string, unknown>;
}

function ok2xx(status: number) {
  return status >= 200 && status < 300;
}

export async function submitProfileAnswers(secretId: string, token: string, answers: { questionId: string; value: unknown }[]) {
  const r = await apiFetch(`/rooms/${encodeURIComponent(secretId)}/profile-answers`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answers }),
  });
  if (!ok2xx(r.status)) throw new Error(await r.text());
}

export async function submitGameAnswer(secretId: string, token: string, questionId: string, value: unknown) {
  const r = await apiFetch(`/rooms/${encodeURIComponent(secretId)}/game-answers`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ questionId, value }),
  });
  if (!ok2xx(r.status)) throw new Error(await r.text());
}

export async function getResults(secretId: string, token: string) {
  const r = await apiFetch(`/rooms/${encodeURIComponent(secretId)}/results`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
