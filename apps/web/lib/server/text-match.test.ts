import { describe, expect, it } from 'vitest';

import { editDistanceBudget, fuzzyTextMatch, levenshtein, normalizeAnswer } from './text-match';

describe('normalizeAnswer', () => {
  it('büyük-küçük harf farkını siler (Türkçe İ/I dahil)', () => {
    expect(normalizeAnswer('İstanbul')).toBe(normalizeAnswer('istanbul'));
    expect(normalizeAnswer('ISTANBUL')).toBe(normalizeAnswer('ıstanbul'));
    expect(normalizeAnswer('İSTANBUL')).toBe(normalizeAnswer('İstanbul'));
  });

  it('Türkçe aksanları indirger', () => {
    expect(normalizeAnswer('köpek')).toBe('kopek');
    expect(normalizeAnswer('ÇİĞDEM')).toBe('cigdem');
    expect(normalizeAnswer('şükrü')).toBe('sukru');
  });

  // Regresyon: aksan temizleme karakter sınıfı bir ara yanlışlıkla
  // [0300-036f] olarak yazılmıştı ve 0/3/6 rakamlarıyla "f" harfini siliyordu.
  it('harf ve rakamlara dokunmaz', () => {
    expect(normalizeAnswer('Fenerbahçe')).toBe('fenerbahce');
    expect(normalizeAnswer('3 kardeş')).toBe('3 kardes');
    expect(normalizeAnswer('06 Ankara')).toBe('06 ankara');
    expect(normalizeAnswer('abcdef')).toBe('abcdef');
  });

  it('noktalama ve fazla boşluğu temizler', () => {
    expect(normalizeAnswer('  kırmızı!  ')).toBe('kirmizi');
    expect(normalizeAnswer('ev - iş')).toBe('ev is');
    expect(normalizeAnswer('a.b,c')).toBe('a b c');
  });
});

describe('levenshtein', () => {
  it('temel uzaklıklar', () => {
    expect(levenshtein('kedi', 'kedi')).toBe(0);
    expect(levenshtein('kopwk', 'kopek')).toBe(1);
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });

  it('max aşılınca erken çıkar', () => {
    expect(levenshtein('abcdefgh', 'zzzzzzzz', 2)).toBeGreaterThan(2);
  });
});

describe('editDistanceBudget', () => {
  it('kısa kelimelerde hata affetmez', () => {
    expect(editDistanceBudget(3)).toBe(0);
    expect(editDistanceBudget(4)).toBe(0);
  });

  it('uzunlukla birlikte artar', () => {
    expect(editDistanceBudget(5)).toBe(1);
    expect(editDistanceBudget(7)).toBe(1);
    expect(editDistanceBudget(8)).toBe(2);
    expect(editDistanceBudget(11)).toBe(2);
    expect(editDistanceBudget(12)).toBe(3);
  });
});

describe('fuzzyTextMatch — eşleşmesi gerekenler', () => {
  it('yalnızca büyük-küçük / aksan farkı', () => {
    expect(fuzzyTextMatch('İstanbul', 'istanbul')).toBe(true);
    expect(fuzzyTextMatch('ISTANBUL', 'İstanbul')).toBe(true);
    expect(fuzzyTextMatch('köpek', 'KÖPEK')).toBe(true);
    expect(fuzzyTextMatch('kopek', 'köpek')).toBe(true);
    expect(fuzzyTextMatch('çilek', 'cilek')).toBe(true);
  });

  it('klavye yazım hatası (kullanıcının örneği)', () => {
    expect(fuzzyTextMatch('kopwk', 'köpek')).toBe(true);
    expect(fuzzyTextMatch('istanbol', 'İstanbul')).toBe(true);
    expect(fuzzyTextMatch('spagetti', 'spageti')).toBe(true);
  });

  it('Türkçe ekler', () => {
    expect(fuzzyTextMatch('kedi', 'kedim')).toBe(true);
    expect(fuzzyTextMatch('İstanbul', 'istanbulda')).toBe(true);
    expect(fuzzyTextMatch('köpek', 'köpekler')).toBe(true);
  });

  it('baştaki/sondaki boşluk ve noktalama', () => {
    expect(fuzzyTextMatch('  mavi ', 'Mavi!')).toBe(true);
  });
});

describe('fuzzyTextMatch — eşleşmemesi gerekenler', () => {
  it('kısa ama farklı kelimeler tek harf uzaklıkta olsa bile', () => {
    expect(fuzzyTextMatch('kedi', 'keçi')).toBe(false);
    expect(fuzzyTextMatch('baba', 'bebe')).toBe(false);
    expect(fuzzyTextMatch('at', 'et')).toBe(false);
  });

  it('apayrı cevaplar', () => {
    expect(fuzzyTextMatch('kedi', 'kuzu')).toBe(false);
    expect(fuzzyTextMatch('İstanbul', 'Ankara')).toBe(false);
    expect(fuzzyTextMatch('mavi', 'yeşil')).toBe(false);
    expect(fuzzyTextMatch('beyaz', 'beyza')).toBe(false);
  });

  it('boş cevap hiçbir şeyle eşleşmez', () => {
    expect(fuzzyTextMatch('', '')).toBe(false);
    expect(fuzzyTextMatch('kedi', '')).toBe(false);
    expect(fuzzyTextMatch('', 'kedi')).toBe(false);
    expect(fuzzyTextMatch('   ', 'kedi')).toBe(false);
  });

  it('kısa kök öneki uzun kelimeyle eşleşmez', () => {
    expect(fuzzyTextMatch('at', 'atkı')).toBe(false);
    expect(fuzzyTextMatch('el', 'elma')).toBe(false);
  });
});
