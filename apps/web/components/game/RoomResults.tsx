'use client';

import { InlineGif } from '@/components/media/InlineGif';
import { WEB_MEDIA } from '@/lib/webMedia';

function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

function formatResultValue(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (Array.isArray(v)) return v.map(String).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function namesFromPlayers(players: unknown[]): { host: string; guest: string } {
  let host = 'Host';
  let guest = 'Misafir';
  for (const p of players) {
    const o = asRecord(p);
    const seat = String(o.seat ?? '');
    const n = String(o.displayName ?? '').trim();
    if (!n) continue;
    if (seat === 'host') host = n;
    if (seat === 'guest') guest = n;
  }
  return { host, guest };
}

type Props = {
  results: unknown;
  players: unknown[];
};

export function RoomResults({ results, players }: Props) {
  if (results === null) {
    return <p className="text-sm text-kk-muted-strong">Sonuçlar yükleniyor…</p>;
  }
  if (!results || typeof results !== 'object') {
    return (
      <pre className="overflow-auto rounded-xl border border-kk-border bg-kk-code p-4 text-xs text-kk-fg-soft">
        {JSON.stringify(results, null, 2)}
      </pre>
    );
  }

  const o = results as Record<string, unknown>;
  const winner = o.winnerSeat as string | null | undefined;
  const per = (o.perPlayer as Record<string, unknown>[]) ?? [];
  const { host, guest } = namesFromPlayers(players);

  const winnerName = winner === 'host' ? host : winner === 'guest' ? guest : null;
  const loserName = winner === 'host' ? guest : winner === 'guest' ? host : null;

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-violet-500/25 bg-violet-950/40 p-6 backdrop-blur-sm">
        <h2 className="font-display text-xl font-bold text-violet-100">Oyun bitti</h2>

        {winner != null && winnerName && loserName ? (
          <div className="mt-4 space-y-4 text-center">
            <p className="font-display text-lg font-semibold leading-snug text-white sm:text-xl">
              <span className="text-white">{winnerName}</span>
              <span className="font-normal text-violet-200/90">, </span>
              <span className="text-violet-100">{loserName}</span>
              <span className="font-normal text-violet-200/95">&apos;i daha iyi tanıyor</span>{' '}
              <span className="inline-block" aria-hidden>
                🏆
              </span>
            </p>
            <InlineGif
              src={WEB_MEDIA.sayMyName}
              fallbackSrc={WEB_MEDIA.sayMyNameFallback}
              decorative
              surface="bare"
              objectPosition="center"
              className="shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)]"
              imgClassName="max-h-44 max-w-[15rem] rounded-2xl border border-kk-border-strong sm:max-h-52 sm:max-w-[17rem]"
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-violet-200">Berabere — ikiniz de efsanesiniz.</p>
        )}

        <p className="mt-4 text-left text-xs text-violet-300/90">
          Aşağıda her turda partnerin gerçek cevabı ile senin tahminini yan yana görebilirsin.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/25 bg-amber-950/25 p-4 backdrop-blur-sm">
        <p className="text-sm font-semibold text-amber-100">Sonucu son söz sanmayın 🤔</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-100/85">
          Yazılan cevaplar birebir tutmadığında puan verilemiyor. Aynı şeyi kastedip farklı
          anlatmış olabilirsiniz — biri &quot;kuzu tandır&quot; yazarken diğeri &quot;et
          yemekleri&quot; demiş olabilir. Aşağıdaki cevapları birlikte gözden geçirin,
          tartışın ve hangilerinin aslında doğru sayılması gerektiğine siz karar verin.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-100/85">
          Sonra puanları yeniden hesaplayın — bakalım gerçek kazanan kim?
        </p>
      </div>

      {per.map((row, idx) => {
        const seat = String(row.seat ?? '');
        const details = (row.details as Record<string, unknown>[]) ?? [];
        return (
          <details
            key={idx}
            className="rounded-2xl border border-kk-border bg-kk-surface p-4 shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] backdrop-blur-md open:border-violet-400/20"
          >
            <summary className="cursor-pointer text-sm font-semibold text-kk-fg-soft">
              {seat === 'host' ? host : guest} — {String(row.score)} / {String(row.max)} doğru
            </summary>
            <ul className="mt-3 space-y-3 border-t border-kk-border pt-3 text-sm">
              {details.map((d, j) => {
                const ok = Boolean(d.correct);
                return (
                  <li
                    key={j}
                    className="rounded-xl border border-kk-border bg-kk-surface-muted p-3 shadow-inner shadow-[inset_0_2px_8px_var(--kk-shadow-card)]"
                  >
                    <div className="flex gap-2">
                      <span className="shrink-0 pt-0.5 text-base" aria-hidden>
                        {ok ? '✓' : '✗'}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="font-medium leading-snug text-kk-fg">{String(d.prompt ?? '')}</p>
                        <div className="grid gap-1 text-xs sm:grid-cols-2 sm:gap-3">
                          <div className="rounded-lg border border-kk-border bg-kk-surface-muted px-2 py-1.5">
                            <p className="font-medium text-kk-muted-strong">Partner cevabı</p>
                            <p className="mt-0.5 text-sm text-kk-fg">{formatResultValue(d.expected)}</p>
                          </div>
                          <div className="rounded-lg border border-kk-border bg-kk-surface-muted px-2 py-1.5">
                            <p className="font-medium text-kk-muted-strong">Senin tahminin</p>
                            <p className="mt-0.5 text-sm text-kk-fg">{formatResultValue(d.answered)}</p>
                          </div>
                        </div>
                        <p className={`text-xs font-semibold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
                          {ok ? 'Doğru' : 'Yanlış'}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </section>
  );
}
