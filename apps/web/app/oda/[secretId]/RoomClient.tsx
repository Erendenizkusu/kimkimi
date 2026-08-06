'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { QuestionFields } from '@/components/game/QuestionFields';
import { RoomResults } from '@/components/game/RoomResults';
import { InlineGif } from '@/components/media/InlineGif';
import {
  getResults,
  getRoomState,
  fetchPublicQuestions,
  submitGameAnswer,
  submitProfileAnswers,
} from '@/lib/api';
import { WEB_MEDIA } from '@/lib/webMedia';
import { MAX_ANSWER_WORDS, needsShortAnswer, sortQuestions, wordCount } from '@/lib/questions';
import { clearRoomSession, loadRoomSession, type RoomSession } from '@/lib/roomSession';
import type { PublicQuestion } from '@/lib/types';

function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

/** API `status` değerini oyuncuya gösterilecek metne çevirir */
function roomStatusLabel(status: string): string {
  switch (status) {
    case 'waiting':
      return 'Oyuncu bekleniyor';
    case 'profile':
      return 'Profil soruları';
    case 'playing':
      return 'Oyun devam ediyor';
    case 'finished':
      return 'Oyun bitti';
    default:
      return status ? 'Hazırlanıyor…' : '…';
  }
}

/** Oda durumunun sunucudan çekilme sıklığı (eski socket.io yayınının yerine). */
const ROOM_POLL_INTERVAL_MS = 2000;

export default function RoomClient({ secretId }: { secretId: string }) {
  const [session, setSession] = useState<RoomSession | null>(null);
  const [boot, setBoot] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<Record<string, unknown> | null>(null);

  const [profileQs, setProfileQs] = useState<PublicQuestion[]>([]);
  const [gameQs, setGameQs] = useState<PublicQuestion[]>([]);
  const [profileVals, setProfileVals] = useState<Record<string, unknown>>({});
  const [gameVal, setGameVal] = useState<unknown>(undefined);
  const [gameSentQid, setGameSentQid] = useState<string | null>(null);
  const [results, setResults] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const status = (roomState?.status as string) || '';
  const category = asRecord(roomState?.category);
  const slug = (category.slug as string) || '';
  const title = (category.title as string) || 'Oda';
  const shortCode = session?.shortCode || String(roomState?.shortCode ?? '') || '';

  const mySeat = session?.isHost ? 'host' : 'guest';

  const profileDone = useMemo(() => {
    const list = (roomState?.profileProgress as unknown[]) ?? [];
    for (const e of list) {
      const o = asRecord(e);
      if (o.seat === mySeat && o.done === true) return true;
    }
    return false;
  }, [roomState, mySeat]);

  const currentQuestionId = (roomState?.currentQuestionId as string) || null;
  const currentGameQ = useMemo(() => {
    if (!currentQuestionId || !gameQs.length) return null;
    return gameQs.find((q) => q.id === currentQuestionId) ?? null;
  }, [currentQuestionId, gameQs]);

  useEffect(() => {
    setGameVal(undefined);
    setGameSentQid(null);
  }, [currentQuestionId]);

  useEffect(() => {
    if (!toast) return;
    const ms = toast.kind === 'error' ? 8000 : 4500;
    const id = window.setTimeout(() => setToast(null), ms);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const sess = loadRoomSession();
    if (!sess || sess.secretId !== secretId) {
      setErr('Oturum bulunamadı. Ana sayfadan odayı tekrar açın veya koda katılın.');
      setBoot(false);
      return;
    }
    setSession(sess);

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Eskiden socket.io `room_state` yayını vardı; Vercel serverless kalıcı
     * WebSocket tutamadığı için sunucu durumu düzenli aralıkla çekiliyor.
     * Oyun iki kişilik ve sıra tabanlı, bu tempo yeterli.
     */
    const poll = async () => {
      if (stopped) return;
      try {
        const st = await getRoomState(secretId, sess.playerToken);
        if (stopped) return;
        setRoomState({ ...st });
        setSyncMsg(null);
      } catch (e) {
        if (!stopped) setSyncMsg(String(e));
      } finally {
        if (!stopped) timer = setTimeout(poll, ROOM_POLL_INTERVAL_MS);
      }
    };

    (async () => {
      try {
        const st = await getRoomState(secretId, sess.playerToken);
        setRoomState(st);
      } catch (e) {
        setErr(String(e));
      } finally {
        setBoot(false);
      }
      timer = setTimeout(poll, ROOM_POLL_INTERVAL_MS);
    })();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [secretId]);

  useEffect(() => {
    if (status !== 'profile' || !slug) return;
    let cancel = false;
    (async () => {
      try {
        const raw = await fetchPublicQuestions(slug, 'profile', secretId);
        if (!cancel) setProfileQs(secretId ? raw : sortQuestions(raw));
      } catch {
        if (!cancel) setProfileQs([]);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [status, slug, secretId]);

  useEffect(() => {
    if (status !== 'playing' || !slug) return;
    let cancel = false;
    (async () => {
      try {
        const raw = await fetchPublicQuestions(slug, 'game', secretId);
        if (!cancel) setGameQs(secretId ? raw : sortQuestions(raw));
      } catch {
        if (!cancel) setGameQs([]);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [status, slug, secretId]);

  useEffect(() => {
    if (status !== 'finished' || !session) return;
    let cancel = false;
    (async () => {
      try {
        const r = await getResults(secretId, session.playerToken);
        if (!cancel) setResults(r);
      } catch {
        if (!cancel) setResults(null);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [status, secretId, session]);

  const leaveRoom = useCallback(() => {
    clearRoomSession();
    window.location.href = '/oyna';
  }, []);

  const onProfileSubmit = async () => {
    if (!session) return;
    const answers: { questionId: string; value: unknown }[] = [];
    for (const q of profileQs) {
      const v = profileVals[q.id];
      if (q.type === 'number' && (typeof v !== 'number' || Number.isNaN(v))) {
        setToast({ kind: 'error', message: `«${q.prompt}» için geçerli sayı gir.` });
        return;
      }
      if (v === null || v === undefined || (typeof v === 'string' && !v.trim())) {
        setToast({ kind: 'error', message: `«${q.prompt}» için cevap gir.` });
        return;
      }
      if (q.type === 'multi_choice' && Array.isArray(v) && v.length === 0) {
        setToast({ kind: 'error', message: `«${q.prompt}» için en az bir seçenek işaretle.` });
        return;
      }
      if (needsShortAnswer(q)) {
        const s = typeof v === 'string' ? v.trim() : String(v).trim();
        if (wordCount(s) > MAX_ANSWER_WORDS) {
          setToast({
            kind: 'error',
            message: `«${q.prompt}»: Metin cevapları en fazla ${MAX_ANSWER_WORDS} kelime olsun.`,
          });
          return;
        }
      }
      answers.push({ questionId: q.id, value: v });
    }
    setBusy(true);
    try {
      await submitProfileAnswers(secretId, session.playerToken, answers);
      setToast({ kind: 'success', message: 'Profil cevapların kaydedildi.' });
    } catch (e) {
      setToast({ kind: 'error', message: String(e) });
    } finally {
      setBusy(false);
    }
  };

  const onGameSubmit = async () => {
    if (!session || !currentGameQ) return;
    if (gameVal === null || gameVal === undefined || (typeof gameVal === 'string' && !gameVal.trim())) {
      setToast({ kind: 'error', message: 'Önce bir cevap seç veya yaz.' });
      return;
    }
    if (needsShortAnswer(currentGameQ)) {
      const s = typeof gameVal === 'string' ? gameVal.trim() : String(gameVal).trim();
      if (wordCount(s) > MAX_ANSWER_WORDS) {
        setToast({ kind: 'error', message: `Metin cevabı en fazla ${MAX_ANSWER_WORDS} kelime olmalı.` });
        return;
      }
    }
    setBusy(true);
    try {
      await submitGameAnswer(secretId, session.playerToken, currentGameQ.id, gameVal);
      setGameSentQid(currentGameQ.id);
      /* Başarı: sayfadaki metin yeterli; ekstra popup yok */
    } catch (e) {
      setToast({ kind: 'error', message: String(e) });
    } finally {
      setBusy(false);
    }
  };

  if (boot) {
    return (
      <div className="flex justify-center py-20">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-violet-400 border-t-transparent motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  if (err && !roomState) {
    return (
      <div className="space-y-4 rounded-2xl border border-[color:var(--kk-callout-error-border)] bg-[color:var(--kk-callout-error-bg)] p-6 text-sm text-[color:var(--kk-callout-error-fg)] backdrop-blur-sm">
        <p>{err}</p>
        <Link href="/oyna" className="font-medium text-kk-link underline decoration-kk-border hover:text-kk-link-hover">
          Oyuna dön →
        </Link>
      </div>
    );
  }

  const players = (roomState?.players as unknown[]) ?? [];

  return (
    <div className="relative space-y-6">
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[100] flex max-w-[min(92vw,24rem)] -translate-x-1/2 items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
            toast.kind === 'success'
              ? 'border-[color:var(--kk-callout-success-border)] bg-[color:var(--kk-callout-success-bg)] text-[color:var(--kk-callout-success-fg)]'
              : 'border-[color:var(--kk-callout-error-border)] bg-[color:var(--kk-callout-error-bg)] text-[color:var(--kk-callout-error-fg)]'
          }`}
        >
          <span className="min-w-0 flex-1 leading-snug">{toast.message}</span>
          <button
            type="button"
            aria-label="Kapat"
            className="shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-current opacity-70 hover:opacity-100"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold text-kk-fg">{title}</h1>
        <p className="mt-1 text-sm text-kk-muted">
          Kod: <span className="font-mono font-semibold tracking-widest">{shortCode}</span>
          {status ? (
            <>
              {' '}
              · {roomStatusLabel(status)}
            </>
          ) : null}
        </p>
        <button
          type="button"
          onClick={leaveRoom}
          className="mt-2 text-xs text-kk-muted-strong underline hover:text-kk-fg-soft"
        >
          Odadan çık
        </button>
      </div>

      {syncMsg && (
        <div className="rounded-xl border border-[color:var(--kk-callout-warn-border)] bg-[color:var(--kk-callout-warn-bg)] px-4 py-3 text-sm text-[color:var(--kk-callout-warn-fg)] backdrop-blur-sm">
          {syncMsg}
        </div>
      )}

      <section className="rounded-2xl border border-kk-border bg-kk-surface p-4 shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] backdrop-blur-md">
        <h2 className="text-sm font-semibold text-kk-fg-soft">Oyuncular</h2>
        <ul className="mt-2 space-y-1 text-sm text-kk-fg-soft">
          {players.map((p, i) => {
            const o = asRecord(p);
            const seat = String(o.seat ?? '');
            const name = String(o.displayName ?? seat);
            const me = seat === mySeat;
            return (
              <li key={i} className="flex items-center gap-2">
                <span>{seat === 'host' ? '★' : '○'}</span>
                <span>{name}</span>
                {me && <span className="text-xs font-semibold text-kk-link">Sen</span>}
              </li>
            );
          })}
        </ul>
      </section>

      {status === 'waiting' && (
        <section className="rounded-2xl border border-kk-border bg-kk-surface p-6 shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] backdrop-blur-md">
          <h2 className="font-display text-lg font-semibold text-kk-fg">Oyuncu bekleniyor</h2>
          {session?.isHost ? (
            <p className="mt-2 text-sm text-kk-muted">
              Kodu arkadaşınla paylaş. Ana sayfadaki <strong>Oyna</strong> bölümünden «Koda katıl» ile girebilir.
            </p>
          ) : (
            <p className="mt-2 text-sm text-kk-muted">Host ve misafir tamamlanınca oyun başlayacak.</p>
          )}
          <InlineGif
            src={WEB_MEDIA.doYouKnow}
            fallbackSrc={WEB_MEDIA.doYouKnowFallback}
            decorative
            objectPosition="bottom"
            className="mt-5 h-60 w-full max-w-xl rounded-xl border border-kk-border sm:mx-auto sm:h-64"
          />
          {session?.isHost && (
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-mono text-lg font-bold tracking-[0.3em] text-white shadow-lg shadow-[0_10px_25px_-5px_var(--kk-shadow-elev)] transition hover:brightness-110"
              onClick={() => navigator.clipboard.writeText(shortCode)}
            >
              {shortCode} — Kopyala
            </button>
          )}
        </section>
      )}

      {status === 'profile' && (
        <section className="space-y-4">
          {profileDone ? (
            <div className="rounded-2xl border border-[color:var(--kk-callout-success-border)] bg-[color:var(--kk-callout-success-bg)] p-6 text-sm text-[color:var(--kk-callout-success-fg)] backdrop-blur-sm">
              Profilini tamamladın. Partner de bitirince oyun başlayacak.
            </div>
          ) : profileQs.length === 0 ? (
            <p className="text-sm text-kk-muted-strong">Sorular yükleniyor…</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 rounded-2xl border border-kk-border bg-kk-surface-muted p-4 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-kk-muted">
                  Önce kendin hakkında dürüst cevaplar ver; sonra partnerin bu cevapları tahmin edecek. Kim kimi daha çok
                  tanıyor, burada belli olur.
                </p>
                <InlineGif
                  src={WEB_MEDIA.weSee}
                  fallbackSrc={WEB_MEDIA.weSeeFallback}
                  decorative
                  objectPosition="bottom"
                  surface="bare"
                  className="h-52 sm:h-56"
                />
              </div>
              <QuestionFields
                questions={profileQs}
                values={profileVals}
                onChange={(id, v) => setProfileVals((prev) => ({ ...prev, [id]: v }))}
                disabled={busy}
              />
              <button
                type="button"
                disabled={busy}
                onClick={onProfileSubmit}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-[0_10px_25px_-5px_var(--kk-shadow-elev)] transition hover:brightness-110 disabled:opacity-50"
              >
                Profili gönder
              </button>
            </>
          )}
        </section>
      )}

      {status === 'playing' && (
        <section className="space-y-4">
          {!currentGameQ ? (
            <p className="text-sm text-kk-muted-strong">Soru yükleniyor…</p>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-kk-link">
                Tur {(Number(roomState?.currentQuestionIndex) ?? 0) + 1} /{' '}
                {Number(roomState?.totalGameQuestions) || '?'}
              </p>
              <p className="text-xs leading-relaxed text-kk-muted">
                Partnerinin profil cevabına en yakın tahmini seç.
              </p>
              <QuestionFields
                questions={[currentGameQ]}
                values={{ [currentGameQ.id]: gameVal }}
                onChange={(_, v) => setGameVal(v)}
                disabled={busy || gameSentQid === currentGameQ.id}
              />
              {gameSentQid === currentGameQ.id ? (
                <p className="text-sm text-kk-muted">
                  Bu soru için cevabın iletildi; partner de yanıtlayınca sıradaki soruya geçilecek.
                </p>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onGameSubmit}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg shadow-[0_10px_25px_-5px_var(--kk-shadow-elev)] transition hover:brightness-110 disabled:opacity-50"
                >
                  Cevabı gönder
                </button>
              )}
            </>
          )}
        </section>
      )}

      {status === 'finished' && <RoomResults results={results} players={players} />}
    </div>
  );
}
