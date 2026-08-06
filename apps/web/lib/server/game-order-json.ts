/** Oda `question_order_json` — şimdilik string[] (oyun soru id sırası) */
export function parseGameOrderJson(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string');
  }
  if (raw && typeof raw === 'object' && 'gameOrder' in (raw as object)) {
    const g = (raw as { gameOrder?: unknown }).gameOrder;
    if (Array.isArray(g)) return g.filter((x): x is string => typeof x === 'string');
  }
  return [];
}
