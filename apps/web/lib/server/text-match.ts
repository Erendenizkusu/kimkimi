/**
 * Serbest metin cevaplarının eşleştirilmesi.
 *
 * İki oyuncu aynı şeyi kastedip farklı yazdığında puan kaybetmemeli:
 *
 *   "İstanbul" / "istanbul"  → normalizasyon (büyük-küçük + Türkçe aksan) çözer
 *   "kopwk"    / "köpek"     → yazım hatası; düzenleme uzaklığı çözer
 *   "kedi"     / "kedim"     → Türkçe ek; önek kuralı çözer
 *
 * Eşik bilerek dar tutuldu: yanlış eşleşme (farklı cevaba puan vermek) kaçırılan
 * eşleşmeden daha kötü, çünkü oyuncu neden puan aldığını anlamıyor.
 */

/** Türkçe aksanları ASCII karşılığına indirger (küçük harfe çevrildikten sonra uygulanır). */
const TR_FOLD: Record<string, string> = {
  ı: 'i',
  i: 'i',
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ö: 'o',
  ç: 'c',
  â: 'a',
  î: 'i',
  û: 'u',
};

/**
 * Karşılaştırma için sadeleştirir: kırp → Türkçe küçük harf → aksan indirge →
 * noktalama at → boşlukları tekille.
 *
 * `toLocaleLowerCase('tr-TR')` "İ" → "i" ve "I" → "ı" verir; ardından gelen
 * indirgeme ikisini de "i" yaptığı için büyük/küçük yazım farkı tamamen kaybolur.
 */
export function normalizeAnswer(input: string): string {
  const lower = input.trim().toLocaleLowerCase('tr-TR');
  let out = '';
  for (const ch of lower) {
    out += TR_FOLD[ch] ?? ch;
  }
  return out
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // kalan birleşik aksan işaretleri
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // noktalama → boşluk
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein düzenleme uzaklığı. `max` verilirse aşıldığı anda `max + 1`
 * döner — uzun metinlerde gereksiz hesap yapmamak için.
 */
export function levenshtein(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/**
 * Kelime uzunluğuna göre kaç harf hata affedilir.
 *
 * 5 harften kısa kelimelerde sıfır: "kedi"/"keçi" ya da "baba"/"bebe" tek harf
 * uzaklıkta ama apayrı cevaplar. Kısa kelimelerde zaten yazım hatası olasılığı
 * düşük, aksan farkını da normalizasyon hallediyor.
 */
export function editDistanceBudget(length: number): number {
  if (length < 5) return 0;
  if (length <= 7) return 1;
  if (length <= 11) return 2;
  return 3;
}

/**
 * İki serbest metin cevabı aynı şeyi mi söylüyor?
 * Boş cevaplar hiçbir zaman eşleşmez.
 */
export function fuzzyTextMatch(expected: string, answered: string): boolean {
  const a = normalizeAnswer(expected);
  const b = normalizeAnswer(answered);
  if (!a || !b) return false;
  if (a === b) return true;

  // Türkçe ekler: "kedi" / "kedim", "istanbul" / "istanbulda".
  // Kök en az 4 harf olmalı, yoksa "at" / "atkı" gibi alakasızlar eşleşir.
  const [shortStr, longStr] = a.length <= b.length ? [a, b] : [b, a];
  if (shortStr.length >= 4 && longStr.startsWith(shortStr)) return true;

  const budget = editDistanceBudget(Math.max(a.length, b.length));
  if (budget === 0) return false;
  return levenshtein(a, b, budget) <= budget;
}
