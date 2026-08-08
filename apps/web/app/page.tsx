import type { Metadata } from 'next';
import Link from 'next/link';

import { KimKimiMark } from '@/components/brand/KimKimiMark';
import { ScrollToHeroCta } from '@/components/home/ScrollToHeroCta';
import { HeroBackdrop } from '@/components/ui/HeroBackdrop';
import { getHeroGifEnvUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Ana sayfa',
};

export default function HomePage() {
  const heroGifEnv = getHeroGifEnvUrl();

  return (
    <div className="space-y-12">
      <section
        id="ana-hero"
        className="relative -mx-4 min-h-[22rem] scroll-mt-24 overflow-hidden rounded-3xl border border-kk-border shadow-2xl shadow-[0_25px_50px_-12px_var(--kk-shadow-elev)] sm:-mx-0 sm:min-h-[26rem]"
      >
        <HeroBackdrop envGifUrl={heroGifEnv} />
        <div className="relative z-10 px-5 py-14 sm:px-10 sm:py-20">
          <div className="mb-6 flex justify-center sm:justify-start motion-safe:animate-fade-in-up motion-safe:opacity-0">
            <KimKimiMark size={72} className="drop-shadow-[0_8px_24px_rgba(91,33,182,0.45)]" />
          </div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-kk-nav-cta motion-safe:animate-fade-in-up motion-safe:opacity-0">
            Tanı · Tahmin · Skor
          </p>
          <h1 className="font-display mt-4 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-kk-fg motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-75 sm:text-5xl">
            Kim kimi ne kadar tanıyor?
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-kk-fg-soft motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-150">
            İki kişilik bir tanıma testi. Önce herkes kendi hakkındaki soruları cevaplar, sonra sıra karşındakini
            tahmin etmeye gelir.{' '}
            <span className="font-semibold text-kk-accent">
              Turlar bitince kimin kimi daha iyi tanıdığı skor tablosunda ortaya çıkar.
            </span>
          </p>
          <p className="mt-4 max-w-lg text-sm font-medium text-kk-muted-strong motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-150">
            Sevgili · Arkadaş · Aile · İş arkadaşı · Antrenman arkadaşı · Eğlence
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-200">
            <Link
              href="/oyna"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 hover:shadow-violet-800/50 active:scale-[0.98]"
            >
              Web’de başlat
            </Link>
            <Link
              href="/nasil-oynanir"
              className="text-sm font-medium text-kk-muted underline decoration-kk-border underline-offset-4 transition hover:text-kk-fg"
            >
              Nasıl oynanır
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="glass-panel overflow-hidden p-6 motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg">🎯</div>
          <h2 className="font-display mt-4 text-lg font-semibold text-kk-fg">Tarayıcıdan oyna</h2>
          <p className="mt-2 text-sm leading-relaxed text-kk-muted">
            Kategori seç, oda aç, kodu paylaş. Profil ve oyun turları web’de; mobil ile aynı mantık.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-kk-muted">
            İki kişi, aynı sorular — kimin kime ne kadar hakim olduğu skor tablosunda ortaya çıkar.
          </p>
          <div className="mt-5">
            <ScrollToHeroCta className="text-sm font-semibold text-kk-link transition hover:text-kk-link-hover">
              Web’de başlat →
            </ScrollToHeroCta>
          </div>
        </div>
        <div className="glass-panel p-6 motion-safe:animate-fade-in-up motion-safe:opacity-0 motion-safe:delay-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 text-lg">📱</div>
          <h2 className="font-display mt-4 text-lg font-semibold text-kk-fg">Mobil uygulama</h2>
          <p className="mt-2 text-sm leading-relaxed text-kk-muted">
            Mağaza bağlantıları yayın öncesi burada olacak (App Store / Google Play).
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-lg border border-kk-border bg-kk-surface-muted px-3 py-1.5 text-xs text-kk-muted-strong">
              App Store (yakında)
            </span>
            <span className="rounded-lg border border-kk-border bg-kk-surface-muted px-3 py-1.5 text-xs text-kk-muted-strong">
              Google Play (yakında)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
