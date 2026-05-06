import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiUrl = process.env.API_URL?.replace(/\/$/, '');
  if (!apiUrl) {
    return NextResponse.json({ message: 'API_URL not configured' }, { status: 500 });
  }
  const body = await req.json();
  const r = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json(data, { status: r.status });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_access_token', data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
