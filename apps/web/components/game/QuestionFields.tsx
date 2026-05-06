'use client';

import type { PublicQuestion } from '@/lib/types';
import { parseChoices } from '@/lib/questions';

type Props = {
  questions: PublicQuestion[];
  values: Record<string, unknown>;
  onChange: (questionId: string, value: unknown) => void;
  disabled?: boolean;
};

const card =
  'rounded-2xl border border-kk-border bg-kk-surface p-4 shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] backdrop-blur-md';

export function QuestionFields({ questions, values, onChange, disabled }: Props) {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className={card}>
          <p className="text-base font-medium leading-snug text-kk-fg">{q.prompt}</p>
          <div className="mt-3">
            <Field q={q} value={values[q.id]} onChange={(v) => onChange(q.id, v)} disabled={disabled} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({
  q,
  value,
  onChange,
  disabled,
}: {
  q: PublicQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled?: boolean;
}) {
  const choices = parseChoices(q.choicesJson);

  if (q.type === 'single_choice' && choices.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {choices.map((c) => {
          const sel = value === c.value;
          return (
            <button
              key={c.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(c.value)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                sel
                  ? 'border-violet-400/60 bg-violet-500/20 text-kk-on-violet-fg shadow-inner shadow-violet-950/40'
                  : 'border-kk-border bg-kk-surface-muted text-kk-fg-soft hover:border-violet-400/30 hover:bg-kk-surface-elevated'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === 'multi_choice' && choices.length > 0) {
    const cur = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="flex flex-col gap-2">
        {choices.map((c) => {
          const sel = cur.includes(c.value);
          return (
            <label
              key={c.value}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                sel
                  ? 'border-violet-400/50 bg-violet-500/15 text-kk-on-violet-fg'
                  : 'border-kk-border bg-kk-surface-muted text-kk-fg-soft hover:border-violet-400/25'
              }`}
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={sel}
                onChange={(e) => {
                  const next = new Set(cur);
                  if (e.target.checked) next.add(c.value);
                  else next.delete(c.value);
                  onChange(Array.from(next));
                }}
                className="rounded border-kk-border-strong bg-kk-check text-violet-500 focus:ring-violet-500/40"
              />
              {c.label}
            </label>
          );
        })}
      </div>
    );
  }

  const inputBase =
    'w-full rounded-xl border border-kk-border-strong bg-kk-input px-3 py-2.5 text-sm shadow-inner shadow-[inset_0_2px_8px_var(--kk-shadow-card)] focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25 disabled:opacity-50';

  if (q.type === 'number') {
    return (
      <input
        type="number"
        disabled={disabled}
        className={inputBase}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        placeholder="Sayı"
      />
    );
  }

  if (q.type === 'date') {
    return (
      <input
        type="date"
        disabled={disabled}
        className={inputBase}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      disabled={disabled}
      className={inputBase}
      value={typeof value === 'string' ? value : value == null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value)}
      placeholder="En fazla 2 kelime"
    />
  );
}
