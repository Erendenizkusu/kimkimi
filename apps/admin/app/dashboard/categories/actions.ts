'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

function apiUrl() {
  const u = process.env.API_URL?.replace(/\/$/, '');
  if (!u) throw new Error('API_URL missing');
  return u;
}

function authHeader() {
  const token = cookies().get('admin_access_token')?.value;
  if (!token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function createCategory(formData: FormData) {
  const slug = String(formData.get('slug') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const sortOrder = Number(formData.get('sortOrder') ?? 0);
  const active = String(formData.get('active') ?? 'true') === 'true';
  const r = await fetch(`${apiUrl()}/admin/categories`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ slug, title, sortOrder, active }),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const sortOrder = Number(formData.get('sortOrder') ?? 0);
  const active = String(formData.get('active') ?? 'true') === 'true';
  const r = await fetch(`${apiUrl()}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify({ title, sortOrder, active }),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function deleteCategory(id: string) {
  const r = await fetch(`${apiUrl()}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}
