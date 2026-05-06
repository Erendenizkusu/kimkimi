/// Kategori [slug] için liste / başlıkta gösterilecek tek emoji (web `categoryEmoji.ts` ile uyumlu).
String emojiForCategorySlug(String slug) {
  final s = slug.trim().toLowerCase();
  const map = <String, String>{
    'sevgili': '❤️',
    'arkadas': '🤝',
    'eglence': '🎉',
    'aile': '🏠',
    'is-arkadasi': '💼',
    'gym-buddy': '🏋️',
  };
  return map[s] ?? '';
}

/// API başlığının yanına emoji ekler (yalnız slug eşleşirse).
String categoryTitleWithEmoji({required String title, required String slug}) {
  final e = emojiForCategorySlug(slug);
  if (e.isEmpty) return title;
  return '$title $e';
}
