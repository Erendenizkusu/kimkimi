import { cookies } from 'next/headers';

function getApiUrl() {
  const url = process.env.API_URL;
  if (!url) throw new Error('API_URL is not set');
  return url.replace(/\/$/, '');
}

export async function serverFetch(path: string, init: RequestInit = {}) {
  const token = cookies().get('admin_access_token')?.value;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}
