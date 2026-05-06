import type { PublicQuestion } from './types';

export type ChoiceItem = { label: string; value: string };

export function parseChoices(raw: unknown): ChoiceItem[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: ChoiceItem[] = [];
  for (const e of raw) {
    if (typeof e === 'string') out.push({ label: e, value: e });
    else if (e && typeof e === 'object') {
      const o = e as Record<string, unknown>;
      const v = o.value ?? o.id ?? o.key;
      const l = o.label ?? o.title ?? v;
      if (v != null) out.push({ label: String(l), value: String(v) });
    }
  }
  return out;
}

export function wordCount(s: string): number {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function needsMaxTwoWords(q: PublicQuestion): boolean {
  if (q.type === 'number' || q.type === 'date' || q.type === 'multi_choice') return false;
  if (q.type === 'single_choice' && parseChoices(q.choicesJson).length > 0) return false;
  return true;
}

export function sortQuestions(qs: PublicQuestion[]) {
  return [...qs].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}
