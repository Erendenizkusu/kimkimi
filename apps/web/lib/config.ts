/**
 * API artık bu Next.js uygulamasının içinde (`app/api/*`) — varsayılan olarak
 * aynı origin'e göreli istek atılır, yani ayrı bir sunucu yok ve soğuk başlangıç
 * beklemesi de yok.
 *
 * `NEXT_PUBLIC_API_URL` yalnızca API'yi başka bir yerde barındırmak istersen
 * (örn. geçiş dönemi veya tünel denemesi) devreye girer.
 */
export function getApiUrl(): string {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!u) return '/api';
  return `${u.replace(/\/$/, '')}/api`;
}

/** Canlı alan adı. `NEXT_PUBLIC_SITE_URL` verilmezse üretimde bu kullanılır. */
export const SITE_URL = 'https://kimkimi.app';

/**
 * Kanonik site kökü — sondaki `/` olmadan. `metadataBase`, sitemap ve robots
 * aynı kaynaktan beslensin diye tek yerde.
 *
 * Sıra: `NEXT_PUBLIC_SITE_URL` → üretimde `SITE_URL` → geliştirmede localhost.
 * Vercel önizleme dağıtımlarında değişken tanımlıysa o kazanır; tanımlı değilse
 * önizleme de kanonik olarak canlı alan adını gösterir (SEO için istenen budur).
 */
export function getSiteUrl(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (u) return u.replace(/\/$/, '');
  return process.env.NODE_ENV === 'production' ? SITE_URL : 'http://localhost:3000';
}

/** Ana sayfa kahraman GIF’i (Breaking Bad vb. kendi dosyanı `public/media/hero.gif` olarak ekleyebilirsin). */
export function getHeroGifEnvUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_HERO_GIF_URL?.trim();
  return u || undefined;
}
