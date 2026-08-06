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

/** Ana sayfa kahraman GIF’i (Breaking Bad vb. kendi dosyanı `public/media/hero.gif` olarak ekleyebilirsin). */
export function getHeroGifEnvUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_HERO_GIF_URL?.trim();
  return u || undefined;
}
