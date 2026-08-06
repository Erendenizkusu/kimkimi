import { DEFAULT_COMPARISON_CHOICES } from './comparison-pair';

/**
 * Kural B geçişi — yayında olan karşılaştırma sorularının oyun metnini düzeltir.
 *
 * `ensureQuestionPairsForCategory` eşleşmeyi **profil** prompt'una göre yapıyor;
 * yayında olan bir profil sorusunu atladığı için havuz dosyasındaki yeni `game`
 * metni mevcut veritabanına kendiliğinden yansımaz. Bu liste eski oyun metnini
 * yeni alıntılı biçimle değiştirir (idempotent: ikinci çalıştırmada eşleşme kalmaz).
 *
 * `choices` verilmişse hem profil hem oyun sorusunun şıkları da güncellenir
 * (örn. arkadaş havuzundaki `O (arkadaşın)` → `O`).
 */
export type ComparisonUpgrade = {
  /** Profil sorusunun metni — şık güncellemesi için */
  profilePrompt: string;
  /** Veritabanındaki mevcut oyun sorusu metni */
  oldGamePrompt: string;
  /** Kural B'ye uygun yeni oyun sorusu metni */
  newGamePrompt: string;
  /** Verilirse iki tarafın da şıkları bununla değiştirilir */
  choices?: string[];
};

/** `<Rakip> “<profil>” sorusuna ne cevap vermiştir?` — comparisonPair ile aynı şablon. */
function quoted(opponent: string, profile: string): string {
  return `${opponent} “${profile}” sorusuna ne cevap vermiştir?`;
}

export const COMPARISON_UPGRADES: ComparisonUpgrade[] = [
  // ——— sevgili ———
  {
    profilePrompt: 'WhatsApp mesajına kim daha çabuk döner?',
    oldGamePrompt: 'Partnerine göre WhatsApp mesajına kim daha çabuk döner?',
    newGamePrompt: quoted('Partnerin', 'WhatsApp mesajına kim daha çabuk döner?'),
  },
  {
    profilePrompt: 'Tartışmadan sonra ilk adım atan kimdir?',
    oldGamePrompt: 'Partnerine göre tartışmadan sonra ilk adım atan kimdir?',
    newGamePrompt: quoted('Partnerin', 'Tartışmadan sonra ilk adım atan kimdir?'),
    // eski sıralama ['O', 'Ben'] idi — standart sıraya çekiliyor
    choices: DEFAULT_COMPARISON_CHOICES,
  },
  {
    profilePrompt: 'İlk “seni seviyorum” diyen kimdi?',
    oldGamePrompt: 'Partnerinize göre ilk “seni seviyorum” diyen kimdi?',
    newGamePrompt: quoted('Partnerin', 'İlk “seni seviyorum” diyen kimdi?'),
  },
  {
    profilePrompt: 'İlk kavganızda kim haklıydı?',
    oldGamePrompt: 'Partnerinize göre ilk kavganızda kim haklıydı?',
    newGamePrompt: quoted('Partnerin', 'İlk kavganızda kim haklıydı?'),
  },

  // ——— arkadaş ———
  {
    profilePrompt: 'Ortak bir işe girseniz işi kim batırır?',
    oldGamePrompt: 'Ortak bir işe girseniz işi kim batırır? (arkadaşının cevabı)',
    newGamePrompt: quoted('Arkadaşın', 'Ortak bir işe girseniz işi kim batırır?'),
    choices: ['Ben', 'O', 'İkimiz de eşit', 'Kimse batırmaz'],
  },
  {
    profilePrompt: 'Karşı cinsle konuşurken sen mi daha özgüvenlisin, o mu?',
    oldGamePrompt: 'Karşı cins ile konuşma konusunda kim daha özgüvenli? (arkadaşının cevabı)',
    newGamePrompt: quoted('Arkadaşın', 'Karşı cinsle konuşurken sen mi daha özgüvenlisin, o mu?'),
    choices: ['Ben', 'O', 'Eşit', 'İkisi de değil / duruma bağlı'],
  },

  // ——— eğlence ———
  {
    profilePrompt: 'Partide tanımadığın biriyle sohbeti kim başlatır?',
    oldGamePrompt: 'Rakibinin tanımadığı biriyle sohbeti kim başlatır?',
    newGamePrompt: quoted('Rakibin', 'Partide tanımadığın biriyle sohbeti kim başlatır?'),
  },

  // ——— iş arkadaşı ———
  {
    profilePrompt: 'Görev paylaşımında “en zor parça” genelde kime kalır?',
    oldGamePrompt: 'Rakibinin görev paylaşımında zor parça kime kalır?',
    newGamePrompt: quoted('Rakibin', 'Görev paylaşımında “en zor parça” genelde kime kalır?'),
  },
  {
    profilePrompt: 'İş arkadaşınla tartışınca barışı ilk kim getirir?',
    oldGamePrompt: 'Rakibinin iş tartışmasında barışı kim getirir?',
    newGamePrompt: quoted('Rakibin', 'İş arkadaşınla tartışınca barışı ilk kim getirir?'),
  },

  // ——— aile ———
  {
    profilePrompt: 'Annen (veya ebeveynin) hangi çocuğuna daha çok kıyamaz? (sence)',
    oldGamePrompt: 'Diğer oyuncunun ebeveyn kimin yanında yumuşar dediği kim?',
    newGamePrompt: quoted(
      'Diğer oyuncu',
      'Annen (veya ebeveynin) hangi çocuğuna daha çok kıyamaz? (sence)',
    ),
  },
  {
    profilePrompt: 'Aile içinde parayı en iyi idare eden sence kim?',
    oldGamePrompt: 'Diğer oyuncunun en cömert veya en idareli dediği kim?',
    newGamePrompt: quoted('Diğer oyuncu', 'Aile içinde parayı en iyi idare eden sence kim?'),
  },
  {
    profilePrompt: 'Aile içi kavgada barışı ilk kim getirirdi?',
    oldGamePrompt: 'Diğer oyuncunun evde barışı ilk getiren kim olduğunu düşünüyor?',
    newGamePrompt: quoted('Diğer oyuncu', 'Aile içi kavgada barışı ilk kim getirirdi?'),
  },
];
