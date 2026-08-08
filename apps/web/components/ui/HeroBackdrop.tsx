'use client';

import { useEffect, useMemo, useState } from 'react';

import { WEB_MEDIA } from '@/lib/webMedia';

type Props = {
  /** `NEXT_PUBLIC_HERO_GIF_URL` — boşsa `/media/hero.gif` denenir */
  envGifUrl?: string | null;
};

/**
 * Ana sayfa kahraman: GIF bölüm kutusunu tamamen doldurur (object-cover).
 * Kutu geniş ve alçak, GIF'ler ise genelde kare — `contain` kullanıldığında
 * ortada küçük bir kare kalıyordu. Kırpma kenarlardan olur, ilgi merkezi ortada.
 */
export function HeroBackdrop({ envGifUrl }: Props) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    const e = envGifUrl?.trim();
    if (e) list.push(e);
    const tail = [
      '/media/hero.gif',
      WEB_MEDIA.waitAMinute,
      WEB_MEDIA.doYouKnow,
      WEB_MEDIA.whoAmI,
      WEB_MEDIA.whoAreU,
    ];
    for (const u of tail) {
      if (!list.includes(u)) list.push(u);
    }
    return list;
  }, [envGifUrl]);

  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const src = candidates[index];
  const showGif = !reduceMotion && index < candidates.length && Boolean(src);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {showGif && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.44]"
          onError={() => setIndex((i) => i + 1)}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--kk-hero-scrim-from)] via-[var(--kk-hero-scrim-via)] to-[var(--kk-hero-scrim-to)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--kk-hero-tint-from)] via-transparent to-[var(--kk-hero-tint-to)]" />
      <div className="hero-noise absolute inset-0 opacity-[0.14]" />
    </div>
  );
}
