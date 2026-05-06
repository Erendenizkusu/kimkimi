/**
 * Üretimde `.env.local` içinde `NEXT_PUBLIC_API_URL` ver.
 * Derleme sırasında tanımlı değilse localhost varsayılır (geliştirme).
 */
export function getApiUrl(): string {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:4000';
  return u.replace(/\/$/, '');
}

/** Ana sayfa kahraman GIF’i (Breaking Bad vb. kendi dosyanı `public/media/hero.gif` olarak ekleyebilirsin). */
export function getHeroGifEnvUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_HERO_GIF_URL?.trim();
  return u || undefined;
}
