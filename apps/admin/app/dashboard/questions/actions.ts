'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { QuestionPhase, QuestionStatus, QuestionType } from './types';

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

/**
 * Formdaki şık alanı.
 * Güncellemede: metin tipinde boş alan şıkları temizler (null). Çoktan seçmede boş = alanı değiştirme.
 */
function parseChoicesJsonFromForm(
  formData: FormData,
  opts?: { mode: 'create' | 'update'; questionType: string },
): unknown | undefined | null {
  const raw = String(formData.get('choicesJson') ?? '').trim();
  if (!raw) {
    if (opts?.mode === 'update' && (opts.questionType === 'text' || opts.questionType === 'date' || opts.questionType === 'number')) {
      return null;
    }
    return undefined;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error('Şıklar geçerli bir JSON olmalı (örn. ["A","B"]).');
  }
}

export async function createQuestion(formData: FormData) {
  const categoryId = String(formData.get('categoryId') ?? '');
  const phase = String(formData.get('phase') ?? 'profile') as QuestionPhase;
  const type = (String(formData.get('type') ?? 'text') || 'text') as QuestionType;
  const prompt = String(formData.get('prompt') ?? '').trim();
  const orderIndex = Number(formData.get('orderIndex') ?? 0);
  const weight = Number(formData.get('weight') ?? 1);
  const status = String(formData.get('status') ?? 'draft') as QuestionStatus;
  const mapsRaw = String(formData.get('mapsToQuestionId') ?? '').trim();
  const mapsToQuestionId = mapsRaw.length ? mapsRaw : null;
  const choicesJson = parseChoicesJsonFromForm(formData, { mode: 'create', questionType: type });

  const r = await fetch(`${apiUrl()}/admin/questions`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      categoryId,
      phase,
      type,
      prompt,
      orderIndex,
      weight,
      status,
      mapsToQuestionId,
      ...(choicesJson !== undefined && choicesJson !== null ? { choicesJson } : {}),
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/questions');
  redirect(`/dashboard/questions?categoryId=${encodeURIComponent(categoryId)}`);
}

export async function updateQuestion(id: string, formData: FormData) {
  const categoryId = String(formData.get('categoryId') ?? '');
  const phase = String(formData.get('phase') ?? 'profile') as QuestionPhase;
  const type = String(formData.get('type') ?? 'text') as QuestionType;
  const prompt = String(formData.get('prompt') ?? '').trim();
  const orderIndex = Number(formData.get('orderIndex') ?? 0);
  const weight = Number(formData.get('weight') ?? 1);
  const status = String(formData.get('status') ?? 'draft') as QuestionStatus;
  const mapsRaw = String(formData.get('mapsToQuestionId') ?? '').trim();
  const mapsToQuestionId = mapsRaw.length ? mapsRaw : null;
  const choicesJson = parseChoicesJsonFromForm(formData, { mode: 'update', questionType: type });

  const r = await fetch(`${apiUrl()}/admin/questions/${id}`, {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify({
      categoryId,
      phase,
      type,
      prompt,
      orderIndex,
      weight,
      status,
      mapsToQuestionId,
      ...(choicesJson !== undefined ? { choicesJson: choicesJson === null ? null : choicesJson } : {}),
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/questions');
  redirect(`/dashboard/questions?categoryId=${encodeURIComponent(categoryId)}`);
}

export async function deleteQuestion(id: string, categoryId: string) {
  const r = await fetch(`${apiUrl()}/admin/questions/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!r.ok) throw new Error(await r.text());
  revalidatePath('/dashboard/questions');
  redirect(`/dashboard/questions?categoryId=${encodeURIComponent(categoryId)}`);
}
