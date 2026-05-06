'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { InlineGif } from '@/components/media/InlineGif';
import { Modal } from '@/components/ui/Modal';
import { createRoom, fetchCategories, joinRoom } from '@/lib/api';
import { emojiForCategorySlug } from '@/lib/categoryEmoji';
import { WEB_MEDIA } from '@/lib/webMedia';
import { saveRoomSession } from '@/lib/roomSession';
import type { Category } from '@/lib/types';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-kk-border-strong bg-kk-input px-3 py-2.5 text-sm shadow-inner focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25 disabled:opacity-50';

export default function OynaPage() {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [hostModal, setHostModal] = useState<{ categoryId: string; title: string } | null>(null);
  const [hostName, setHostName] = useState('Host');
  const [hostSubmitting, setHostSubmitting] = useState(false);

  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('Misafir');
  const [joinSubmitting, setJoinSubmitting] = useState(false);

  const hostInputRef = useRef<HTMLInputElement>(null);
  const joinCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        setErr(null);
        const list = await fetchCategories();
        if (!c) setCats(list);
      } catch (e) {
        if (!c) setErr(String(e));
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  useEffect(() => {
    if (hostModal) {
      setHostName('Host');
      queueMicrotask(() => hostInputRef.current?.focus());
    }
  }, [hostModal]);

  useEffect(() => {
    if (joinOpen) {
      setJoinCode('');
      setJoinName('Misafir');
      queueMicrotask(() => joinCodeRef.current?.focus());
    }
  }, [joinOpen]);

  const closeHostModal = () => {
    if (hostSubmitting) return;
    setHostModal(null);
  };

  const closeJoinModal = () => {
    if (joinSubmitting) return;
    setJoinOpen(false);
  };

  const submitHost = async () => {
    if (!hostModal) return;
    const name = hostName.trim();
    if (!name) {
      setErr('Görünen ad boş olamaz.');
      return;
    }
    setErr(null);
    setHostSubmitting(true);
    try {
      const r = await createRoom(hostModal.categoryId, name);
      saveRoomSession({
        secretId: r.secretId,
        playerToken: r.hostPlayerToken,
        shortCode: r.shortCode,
        isHost: true,
      });
      setHostModal(null);
      router.push(`/oda/${encodeURIComponent(r.secretId)}`);
    } catch (e) {
      setErr(String(e));
    } finally {
      setHostSubmitting(false);
    }
  };

  const submitJoin = async () => {
    const code = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!code) {
      setErr('Geçerli bir oda kodu gir.');
      return;
    }
    const guest = joinName.trim();
    if (!guest) {
      setErr('Görünen ad boş olamaz.');
      return;
    }
    setErr(null);
    setJoinSubmitting(true);
    try {
      const r = await joinRoom(code, guest);
      saveRoomSession({
        secretId: r.secretId,
        playerToken: r.guestPlayerToken,
        shortCode: code,
        isHost: false,
      });
      setJoinOpen(false);
      router.push(`/oda/${encodeURIComponent(r.secretId)}`);
    } catch (e) {
      setErr(String(e));
    } finally {
      setJoinSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <Modal
        open={Boolean(hostModal)}
        title="Oda aç"
        description={
          hostModal ? `Kategori: ${hostModal.title}. Bu isim oyunda görünecek.` : undefined
        }
        onClose={closeHostModal}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitHost();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="host-display-name" className="text-sm font-medium text-kk-fg-soft">
              Görünen adın
            </label>
            <input
              id="host-display-name"
              ref={hostInputRef}
              type="text"
              autoComplete="nickname"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              disabled={hostSubmitting}
              className={inputClass}
              placeholder="örn. Eren"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeHostModal}
              disabled={hostSubmitting}
              className="rounded-xl border border-kk-border-strong bg-kk-surface-muted px-4 py-2.5 text-sm font-medium text-kk-fg-soft transition hover:bg-kk-surface-elevated disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={hostSubmitting}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[0_10px_25px_-5px_var(--kk-shadow-elev)] transition hover:brightness-110 disabled:opacity-50"
            >
              {hostSubmitting ? 'Açılıyor…' : 'Odayı aç'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={joinOpen}
        title="Koda katıl"
        description="Host’un paylaştığı kodu ve odada görünecek adını gir."
        onClose={closeJoinModal}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitJoin();
          }}
          className="space-y-4"
        >
          <InlineGif
            src={WEB_MEDIA.doYouKnow}
            fallbackSrc={WEB_MEDIA.doYouKnowFallback}
            decorative
            objectPosition="bottom"
            className="h-40 w-full rounded-xl border border-kk-border sm:h-44"
          />
          <div>
            <label htmlFor="join-room-code" className="text-sm font-medium text-kk-fg-soft">
              Oda kodu
            </label>
            <input
              id="join-room-code"
              ref={joinCodeRef}
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={joinCode}
              onChange={(e) =>
                setJoinCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 12),
                )
              }
              disabled={joinSubmitting}
              className={`${inputClass} font-mono tracking-widest uppercase`}
              placeholder="ABC123"
              maxLength={12}
            />
          </div>
          <div>
            <label htmlFor="join-display-name" className="text-sm font-medium text-kk-fg-soft">
              Görünen adın
            </label>
            <input
              id="join-display-name"
              type="text"
              autoComplete="nickname"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              disabled={joinSubmitting}
              className={inputClass}
              placeholder="örn. Ayşe"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeJoinModal}
              disabled={joinSubmitting}
              className="rounded-xl border border-kk-border-strong bg-kk-surface-muted px-4 py-2.5 text-sm font-medium text-kk-fg-soft transition hover:bg-kk-surface-elevated disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={joinSubmitting}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[0_10px_25px_-5px_var(--kk-shadow-elev)] transition hover:brightness-110 disabled:opacity-50"
            >
              {joinSubmitting ? 'Katılıyor…' : 'Odaya gir'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <h1 className="font-display text-3xl font-bold tracking-tight text-kk-fg">Web’den oyna</h1>
          <p className="text-kk-muted">
            Bir kategori seçerek oda aç, arkadaşınla kodu paylaş; ya da elindeki kodla doğrudan odaya katıl. İkiniz de
            hazır olunca profil ve tahmin turları başlar.
          </p>
        </div>
        <InlineGif
          src={WEB_MEDIA.waitAMinute}
          fallbackSrc={WEB_MEDIA.waitAMinuteFallback}
          decorative
          surface="bare"
          objectPosition="center"
          className="w-full shrink-0 self-start sm:w-[min(240px,40%)]"
          imgClassName="mx-auto max-h-48 w-auto max-w-full rounded-2xl border border-kk-border object-contain sm:max-h-56"
        />
      </div>

      {err && (
        <div className="rounded-xl border border-[color:var(--kk-callout-error-border)] bg-[color:var(--kk-callout-error-bg)] px-4 py-3 text-sm text-[color:var(--kk-callout-error-fg)] whitespace-pre-wrap backdrop-blur-sm">
          {err}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setJoinOpen(true)}
          className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-kk-chip-violet-fg shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] transition hover:border-violet-400/45 hover:bg-violet-500/18"
        >
          Koda katıl
        </button>
        <Link
          href="/"
          className="rounded-xl border border-kk-border bg-kk-surface-muted px-5 py-2.5 text-sm font-medium text-kk-fg-soft transition hover:bg-kk-surface-elevated hover:text-kk-fg"
        >
          Ana sayfa
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-violet-400 border-t-transparent motion-reduce:animate-none" />
          </div>
        </div>
      ) : (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-kk-fg">Kategoriler</h2>
          {cats.length === 0 ? (
            <p className="text-sm text-kk-muted-strong">
              Şu an listelenecek kategori bulunamadı. Biraz sonra tekrar dene; sorun sürerse yöneticine haber ver.
            </p>
          ) : (
            <ul className="space-y-3">
              {cats.map((c) => {
                const catEmoji = emojiForCategorySlug(c.slug);
                return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setHostModal({ categoryId: c.id, title: c.title })}
                    className="group flex w-full items-center justify-between rounded-2xl border border-kk-border bg-kk-surface px-5 py-4 text-left shadow-lg shadow-[0_12px_30px_-8px_var(--kk-shadow-card)] backdrop-blur-md transition hover:border-violet-400/35 hover:bg-violet-500/10"
                  >
                    <span className="font-medium text-kk-fg">
                      {c.title}
                      {catEmoji ? (
                        <span className="ml-1.5 inline select-none" aria-hidden>
                          {catEmoji}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-kk-link transition group-hover:translate-x-0.5 group-hover:text-kk-link-hover">
                      →
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
