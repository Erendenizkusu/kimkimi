import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';

/**
 * NestJS'in HttpException karşılığı. Route handler'lar bunu fırlatır,
 * `handle()` tek noktada JSON'a çevirir — istemcideki hata metinleri
 * (userFacingErrors.ts) aynı `{ statusCode, message }` şeklini bekliyor.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const badRequest = (m: string) => new ApiError(400, m);
export const unauthorized = (m: string) => new ApiError(401, m);
export const forbidden = (m: string) => new ApiError(403, m);
export const notFound = (m: string) => new ApiError(404, m);
export const conflict = (m: string) => new ApiError(409, m);

/** Mobil ve admin farklı origin'lerden çağırıyor; tarayıcı istemcileri için gerekli. */
function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function json(body: unknown, status = 200) {
  return NextResponse.json(body as Record<string, unknown>, {
    status,
    headers: corsHeaders(),
  });
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/**
 * Route handler gövdesini sarar: ApiError → ilgili status, Zod hatası → 400,
 * beklenmeyen hata → 500 (detay loglanır, istemciye sızmaz).
 */
export async function handle(fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    if (result instanceof NextResponse) return result;
    return json(result ?? { ok: true });
  } catch (e) {
    if (e instanceof ApiError) {
      return json({ statusCode: e.status, message: e.message }, e.status);
    }
    if (e instanceof ZodError) {
      return json(
        {
          statusCode: 400,
          message: e.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`),
        },
        400,
      );
    }
    console.error('[api] beklenmeyen hata', e);
    return json({ statusCode: 500, message: 'Internal server error' }, 500);
  }
}

/** Gövdeyi şemaya göre doğrular; gövde JSON değilse 400 döner. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw badRequest('Geçersiz JSON gövdesi');
  }
  return schema.parse(raw);
}

/** `Authorization: Bearer <token>` başlığından ham token'ı çıkarır. */
export function bearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const t = auth.slice('Bearer '.length).trim();
  return t || null;
}
