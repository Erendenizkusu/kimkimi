import { QuestionType } from '@prisma/client';
import { ScoringService } from './scoring.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    service = new ScoringService({} as PrismaService);
  });

  it('compares Turkish text case-insensitive', () => {
    expect(service.compareValues(QuestionType.text, 'İstanbul', 'istanbul')).toBe(true);
    expect(service.compareValues(QuestionType.text, '  Mavi ', 'mavi')).toBe(true);
  });

  it('compares single_choice', () => {
    expect(service.compareValues(QuestionType.single_choice, 'a', 'a')).toBe(true);
    expect(service.compareValues(QuestionType.single_choice, 'a', 'b')).toBe(false);
  });

  it('single_choice Ben/O: aynı kişiyi farklı şıklarla ifade (yalnız şıklarda Ben ve O varken)', () => {
    const three = ['Ben', 'O', 'İkimiz de biraz'];
    expect(service.compareValues(QuestionType.single_choice, 'Ben', 'O', three)).toBe(true);
    expect(service.compareValues(QuestionType.single_choice, 'O', 'Ben', three)).toBe(true);
    expect(service.compareValues(QuestionType.single_choice, 'Ben', 'Ben', three)).toBe(true);
    expect(service.compareValues(QuestionType.single_choice, 'Ben', 'İkimiz de biraz', three)).toBe(false);
    expect(service.compareValues(QuestionType.single_choice, 'Ben', 'O', undefined)).toBe(false);
    expect(service.compareValues(QuestionType.single_choice, 'Ben', 'O', ['Evet', 'Hayır'])).toBe(false);
  });

  it('compares multi_choice order-independently', () => {
    expect(service.compareValues(QuestionType.multi_choice, ['b', 'a'], ['a', 'b'])).toBe(true);
  });
});
