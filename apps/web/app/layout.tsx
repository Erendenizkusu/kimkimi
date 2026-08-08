import type { Metadata, Viewport } from 'next';
import { DM_Sans, Outfit } from 'next/font/google';
import Link from 'next/link';

import { KimKimiMark } from '@/components/brand/KimKimiMark';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { getSiteUrl } from '@/lib/config';

import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

/** Küçük ekranlarda doğru ölçek; adres çubuğu rengi varsayılan koyu tema ile uyumlu. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  // Göreli yollar (canonical, OG görseli) bunun üstüne kuruluyor. Tanımsız
  // bırakılırsa Next localhost'u varsayar ve paylaşım önizlemeleri kırılır.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'KimKimi — Kim kimi ne kadar tanıyor?',
    template: '%s | KimKimi',
  },
  description:
    'İki kişilik, kategorilere göre sorular ve puanlı bilgi yarışması. Arkadaş, sevgili veya spor arkadaşınla oyna.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KimKimi',
    description: 'Kim kimi ne kadar tanıyor? Kategori seç, soruları cevapla, skorunu gör.',
    url: '/',
    siteName: 'KimKimi',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KimKimi',
    description: 'Kim kimi ne kadar tanıyor? Kategori seç, soruları cevapla, skorunu gör.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-theme="dark" suppressHydrationWarning className={`${dmSans.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-kk-page font-sans text-kk-fg antialiased">
        <ThemeProvider>
          <AmbientBackground />
          <header className="sticky top-0 z-50 border-b border-kk-border bg-kk-header backdrop-blur-xl">
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-kk-logo transition hover:text-kk-logo-hover"
              >
                <KimKimiMark size={34} />
                <span>KimKimi</span>
              </Link>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-2">
                  <Link href="/oyna" className="glass-nav-link font-medium text-kk-nav-cta">
                    Oyna
                  </Link>
                  <Link href="/nasil-oynanir" className="glass-nav-link">
                    Nasıl oynanır
                  </Link>
                  <Link href="/gizlilik" className="glass-nav-link">
                    Gizlilik
                  </Link>
                  <Link href="/kullanim" className="glass-nav-link">
                    Kullanım şartları
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="relative z-10 mx-auto max-w-3xl px-4 py-10">{children}</main>
          <footer className="relative z-10 border-t border-kk-border py-8 text-center text-sm text-kk-footer backdrop-blur-sm">
            <div className="mx-auto flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <KimKimiMark size={28} className="opacity-90" />
              <span>© {new Date().getFullYear()} KimKimi</span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
