/**
 * Kategori `slug` değerine göre liste satırında gösterilecek tek emoji.
 * API’ye yeni slug eklendiğinde burayı güncelle.
 */
export function emojiForCategorySlug(slug: string): string {
  const s = slug.trim().toLowerCase();
  const map: Record<string, string> = {
    sevgili: '❤️',
    arkadas: '🤝',
    eglence: '🎉',
    aile: '🏠',
    'is-arkadasi': '💼',
    'gym-buddy': '🏋️',
  };
  return map[s] ?? '';
}
