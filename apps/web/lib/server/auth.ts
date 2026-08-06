import * as bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

import { unauthorized } from './http';
import { prisma } from './prisma';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type JwtAdminPayload = {
  sub: string;
  email: string;
  role: string;
};

function secretKey(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET tanımlı değil');
  return new TextEncoder().encode(s);
}

function expiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? '8h';
}

export async function login(dto: LoginInput) {
  const admin = await prisma.adminUser.findUnique({ where: { email: dto.email } });
  if (!admin) throw unauthorized('Invalid credentials');
  const ok = await bcrypt.compare(dto.password, admin.passwordHash);
  if (!ok) throw unauthorized('Invalid credentials');

  const accessToken = await new SignJWT({ email: admin.email, role: admin.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(expiresIn())
    .sign(secretKey());

  return { accessToken, expiresIn: expiresIn() };
}

/**
 * NestJS'teki JwtAuthGuard + RolesGuard('admin') karşılığı.
 * Geçersiz/süresi dolmuş token veya admin olmayan rol → 401.
 */
export async function requireAdmin(token: string | null): Promise<JwtAdminPayload> {
  if (!token) throw unauthorized('Missing bearer token');
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] });
    const sub = payload.sub;
    const role = typeof payload.role === 'string' ? payload.role : '';
    const email = typeof payload.email === 'string' ? payload.email : '';
    if (!sub || role !== 'admin') throw unauthorized('Forbidden');
    return { sub, email, role };
  } catch {
    throw unauthorized('Invalid token');
  }
}
