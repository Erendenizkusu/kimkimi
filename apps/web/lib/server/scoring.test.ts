import { QuestionType } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { compareValues } from './scoring';

describe('compareValues — text', () => {
  it('aksan/büyük-küçük farkını ve yazım hatasını affeder', () => {
    expect(compareValues(QuestionType.text, 'İstanbul', 'istanbul')).toBe(true);
    expect(compareValues(QuestionType.text, 'köpek', 'kopwk')).toBe(true);
    expect(compareValues(QuestionType.text, 'kedi', 'kedim')).toBe(true);
  });

  it('farklı cevaplara puan vermez', () => {
    expect(compareValues(QuestionType.text, 'kedi', 'keçi')).toBe(false);
    expect(compareValues(QuestionType.text, 'İstanbul', 'Ankara')).toBe(false);
  });

  it('boş tahmin yanlıştır', () => {
    expect(compareValues(QuestionType.text, 'kedi', '')).toBe(false);
    expect(compareValues(QuestionType.text, 'kedi', null)).toBe(false);
    expect(compareValues(QuestionType.text, 'kedi', undefined)).toBe(false);
  });
});

describe('compareValues — date', () => {
  it('tarihte tolerans yok', () => {
    expect(compareValues(QuestionType.date, '1995-06-15', '1995-06-15')).toBe(true);
    expect(compareValues(QuestionType.date, '1995-06-15', '1995-06-16')).toBe(false);
  });
});

describe('compareValues — number', () => {
  it('sayısal eşitlik, tip farkı önemsiz', () => {
    expect(compareValues(QuestionType.number, 3, '3')).toBe(true);
    expect(compareValues(QuestionType.number, 3, 4)).toBe(false);
  });
});

describe('compareValues — single_choice', () => {
  it('şıklar birebir eşleşir', () => {
    expect(compareValues(QuestionType.single_choice, 'Kahve', 'Kahve')).toBe(true);
    expect(compareValues(QuestionType.single_choice, 'Kahve', 'Çay')).toBe(false);
  });

  it('Ben/O çift perspektifi: partner “Ben” dediyse tahmin “O” da doğrudur', () => {
    const choices = ['Ben', 'O'];
    expect(compareValues(QuestionType.single_choice, 'Ben', 'O', choices)).toBe(true);
    expect(compareValues(QuestionType.single_choice, 'O', 'Ben', choices)).toBe(true);
  });

  it('Ben/O çifti olmayan sorularda perspektif kuralı uygulanmaz', () => {
    const choices = ['Ben', 'Annem'];
    expect(compareValues(QuestionType.single_choice, 'Ben', 'O', choices)).toBe(false);
  });
});

describe('compareValues — multi_choice', () => {
  it('sıradan bağımsız küme karşılaştırması', () => {
    expect(compareValues(QuestionType.multi_choice, ['a', 'b'], ['b', 'a'])).toBe(true);
    expect(compareValues(QuestionType.multi_choice, ['a', 'b'], ['a'])).toBe(false);
  });
});
