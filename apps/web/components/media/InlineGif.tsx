'use client';

import { useEffect, useState } from 'react';

type Props = {
  src: string;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover';
  /**
   * contain + bottom: GIF altta; dış `className` ile yükseklik ver (örn. `h-52`).
   */
  objectPosition?: 'center' | 'bottom';
  /**
   * card: koyu zemin (varsayılan). bare: arka plan yok, kutu GIF genişliğinde (`w-fit`).
   */
  surface?: 'card' | 'bare';
  decorative?: boolean;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

export function InlineGif({
  src,
  fallbackSrc,
  objectFit = 'contain',
  objectPosition = 'center',
  surface = 'card',
  decorative = true,
  alt = '',
  className,
  imgClassName,
}: Props) {
  const [broken, setBroken] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setActiveSrc(src);
    setBroken(false);
  }, [src]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const onImgError = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
      return;
    }
    setBroken(true);
  };

  if (broken || reduceMotion) return null;

  const isContain = objectFit === 'contain';
  const anchorBottom = isContain && objectPosition === 'bottom';
  const bare = surface === 'bare';
  const cardShell = !bare && 'overflow-hidden bg-kk-gif-card';

  if (!isContain) {
    return (
      <div className={`${bare ? '' : 'bg-kk-gif-card'} ${className ?? ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeSrc}
          alt={decorative ? '' : alt}
          decoding="async"
          role={decorative ? 'presentation' : undefined}
          className={`h-full w-full object-cover object-center ${imgClassName ?? ''}`}
          onError={onImgError}
        />
      </div>
    );
  }

  if (anchorBottom) {
    if (bare) {
      return (
        <div
          className={`mx-auto flex w-fit max-w-full items-end justify-center ${className ?? ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt={decorative ? '' : alt}
            decoding="async"
            role={decorative ? 'presentation' : undefined}
            className={`max-h-full w-auto max-w-full object-contain object-bottom ${imgClassName ?? ''}`}
            onError={onImgError}
          />
        </div>
      );
    }
    return (
      <div className={`relative min-h-0 ${cardShell} ${className ?? ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeSrc}
          alt={decorative ? '' : alt}
          decoding="async"
          role={decorative ? 'presentation' : undefined}
          className={`absolute bottom-0 left-1/2 max-h-full w-full max-w-full -translate-x-1/2 object-contain object-bottom ${imgClassName ?? ''}`}
          onError={onImgError}
        />
      </div>
    );
  }

  /** contain + bare + ortala: kutu GIF’e göre; `imgClassName` ile max yükseklik ver */
  if (bare) {
    return (
      <div className={`mx-auto w-fit max-w-full ${className ?? ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeSrc}
          alt={decorative ? '' : alt}
          decoding="async"
          role={decorative ? 'presentation' : undefined}
          className={`block h-auto w-auto max-w-full object-contain object-center ${imgClassName ?? 'max-h-40 sm:max-h-44 max-w-[16rem]'}`}
          onError={onImgError}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-0 items-center justify-center ${cardShell} ${className ?? ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeSrc}
        alt={decorative ? '' : alt}
        decoding="async"
        role={decorative ? 'presentation' : undefined}
        className={`block max-h-full w-full max-w-full object-contain object-center ${imgClassName ?? ''}`}
        onError={onImgError}
      />
    </div>
  );
}
