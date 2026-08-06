/**
 * Yalnızca gerçekten **kapalı küme** olan sorular (evet/hayır, iki/üç net seçenek).
 * Yemek, renk, müzik, film, masa oyunu gibi açık uçlu konular burada OLMAMALI;
 * bunlar klavye + kısa metin (mobil tarafta kelime sınırı) ile kalır.
 * Uzun serbest metinde karakter eşleşmesi zor olur diye MC düşünülenler ayrıca
 * `question-open-text-prompts` ile metne çekilir / hiç MC yapılmaz.
 */
export type ChoiceFormatUpgrade = {
  phase: 'profile' | 'game';
  prompt: string;
  choices: string[];
};

export const CHOICE_FORMAT_UPGRADES: ChoiceFormatUpgrade[] = [
  {
    phase: 'profile',
    prompt: 'Planlı mısın, spontane misin? (Kısaca anlat)',
    choices: ['Planlı', 'Spontane'],
  },
  {
    phase: 'game',
    prompt: 'Partnerin daha çok planlı mı, spontane mi? Nasıl tarif ederdin?',
    choices: ['Planlı', 'Spontane'],
  },
  {
    phase: 'profile',
    prompt: 'Hayalindeki kısa tatil: deniz mi, şehir mi, doğa mı?',
    choices: ['Deniz', 'Şehir', 'Doğa'],
  },
  {
    phase: 'game',
    prompt: 'Partnerinin hayalindeki tatil tipi nedir?',
    choices: ['Deniz', 'Şehir', 'Doğa'],
  },
  {
    phase: 'profile',
    prompt: 'Kahve mi çay mı? (Seç ve kısaca neden)',
    choices: ['Kahve', 'Çay'],
  },
  {
    phase: 'game',
    prompt: 'Arkadaşın kahveci mi çaycı mı?',
    choices: ['Kahve', 'Çay'],
  },
  {
    phase: 'profile',
    prompt: 'Sabah insanı mısın gece kuşu musun?',
    choices: ['Sabah insanı', 'Gece kuşu'],
  },
  {
    phase: 'game',
    prompt: 'Arkadaşın sabahçı mı gececi?',
    choices: ['Sabah insanı', 'Gece kuşu'],
  },
  {
    phase: 'profile',
    prompt: 'Uzaktan mı ofisten mi verimli hissedersin?',
    choices: ['Uzaktan', 'Ofisten'],
  },
  {
    phase: 'game',
    prompt: 'Rakibin uzaktan mı ofisten mi daha verimli?',
    choices: ['Uzaktan', 'Ofisten'],
  },
  {
    phase: 'profile',
    prompt: '\u201cBu mu şu mu\u201d: yaz mı doğa mı?',
    choices: ['Yaz', 'Doğa'],
  },
  {
    phase: 'game',
    prompt: 'Rakibin yaz mı doğa mı seçerdi?',
    choices: ['Yaz', 'Doğa'],
  },
  {
    phase: 'profile',
    prompt: 'Komedi mi dram mı? (Film/dizi tercihi)',
    choices: ['Komedi', 'Dram'],
  },
  {
    phase: 'game',
    prompt: 'Rakibinin komedi mi dram mı tercihi nedir?',
    choices: ['Komedi', 'Dram'],
  },
];
