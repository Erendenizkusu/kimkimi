import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

/**
 * Arkadaş kategorisi — Masaüstü `sorularArkadas.txt` ile uyumlu havuz.
 * Profil: sen; oyun: arkadaşının cevabını tahmin.
 */
export const ARKADAS_TYPED_PAIRS: TypedQuestionPair[] = [
  {
    profile: 'En sevdiğin renk nedir?',
    game: 'Arkadaşının en sevdiği renk nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin yemek nedir?',
    game: 'Arkadaşının en sevdiği yemek nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin içecek nedir?',
    game: 'Arkadaşının en sevdiği içecek nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin tatlı nedir?',
    game: 'Arkadaşının en sevdiği tatlı nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin film nedir?',
    game: 'Arkadaşının en sevdiği film nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin dizi nedir?',
    game: 'Arkadaşının en sevdiği dizi nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin müzik türü nedir?',
    game: 'Arkadaşının en sevdiği müzik türü nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin aktör kimdir?',
    game: 'Arkadaşının en sevdiği aktör kimdir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin mevsim hangisidir?',
    game: 'Arkadaşının en sevdiği mevsim hangisidir?',
    type: QuestionType.single_choice,
    choices: ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'],
  },
  {
    profile: 'En sevdiğin sosyal medya uygulaması hangisidir?',
    game: 'Arkadaşının en sevdiği sosyal medya uygulaması hangisidir?',
    type: QuestionType.single_choice,
    choices: ['YouTube', 'Instagram', 'TikTok', 'Facebook'],
  },
  {
    profile: 'Kahveyi mi daha çok seversin, çayı mı?',
    game: 'Arkadaşın kahveyi mi daha çok sever, çayı mı?',
    type: QuestionType.text,
  },
  {
    profile: 'Gece insanı mısın, sabah insanı mısın?',
    game: 'Arkadaşın gece insanı mı, sabah insanı mı?',
    type: QuestionType.single_choice,
    choices: ['Gece insanı', 'Sabah insanı', 'İkisi de değil / orta'],
  },
  {
    profile: 'Kalabalık ortamları mı seversin, sakin ortamları mı?',
    game: 'Arkadaşın kalabalık ortamları mı sever, sakin ortamları mı?',
    type: QuestionType.single_choice,
    choices: ['Kalabalık', 'Sakin', 'Duruma göre'],
  },
  {
    profile: 'Tatile giderken deniz mi seçersin, doğa mı?',
    game: 'Arkadaşın tatile giderken deniz mi seçer, doğa mı?',
    type: QuestionType.single_choice,
    choices: ['Deniz', 'Doğa', 'İkisi de'],
  },
  {
    profile: 'Planlı biri misin, anlık yaşayan biri misin?',
    game: 'Arkadaşın planlı biri midir, anlık yaşayan biri midir?',
    type: QuestionType.single_choice,
    choices: ['Planlı', 'Anlık / spontane', 'Arada'],
  },
  {
    profile: 'Geç kalma huyun var mıdır?',
    game: 'Arkadaşının geç kalma huyu var mıdır?',
    type: QuestionType.single_choice,
    choices: ['Hayır, her zaman dakiktir', 'Evet, genelde geç kalır', 'Bir kere erken geldiğini hatırlamıyorum'],
  },
  {
    profile: 'En çok hangi konuda üşengeçlik yaparsın?',
    game: 'Arkadaşın en çok hangi konuda üşengeçlik yapar?',
    type: QuestionType.text,
  },
  {
    profile: 'Ortak bir işe girseniz işi kim batırır?',
    game: 'Ortak bir işe girseniz işi kim batırır? (arkadaşının cevabı)',
    type: QuestionType.single_choice,
    choices: ['O (arkadaşın)', 'Ben', 'İkimiz de eşit', 'Kimse batırmaz'],
  },
  {
    profile: 'Mesajlaşmayı mı seversin, aramayı mı?',
    game: 'Arkadaşın mesajlaşmayı mı sever, aramayı mı?',
    type: QuestionType.single_choice,
    choices: ['Mesajlaşma', 'Arama', 'İkisi de', 'İkisini de pek sevmez'],
  },
  {
    profile: 'Doğum günün ne zaman?',
    game: 'Arkadaşının doğum günü ne zaman?',
    type: QuestionType.date,
  },
  {
    profile: 'Burcun nedir?',
    game: 'Arkadaşının burcu nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Kaç kardeşin var?',
    game: 'Arkadaşının kaç kardeşi var?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken en sevdiğin ders neydi?',
    game: 'Arkadaşının çocukken en sevdiği ders neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Bir ortamda sende ilk dikkat çeken özellik ne?',
    game: 'Bir ortamda arkadaşında ilk dikkat çeken özellik nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En güçlü karakter özelliğin nedir?',
    game: 'Arkadaşının en güçlü karakter özelliği nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En zayıf yönünün ne olduğunu düşünüyorsun?',
    game: 'Arkadaşının en zayıf yönü sence nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Kolay küser misin?',
    game: 'Arkadaşın kolay küser mi?',
    type: QuestionType.single_choice,
    choices: ['Evet', 'Hayır', 'Bazen'],
  },
  {
    profile: 'Sır tutma konusunda iyi misin?',
    game: 'Arkadaşın sır tutma konusunda iyi midir?',
    type: QuestionType.single_choice,
    choices: ['Evet, iyi', 'Hayır', 'Ağzında bakla ıslanmaz'],
  },
  {
    profile: 'Cimri misin, bonkör müsün?',
    game: 'Arkadaşın cimri midir, bonkör mü?',
    type: QuestionType.single_choice,
    choices: ['Cimri', 'Bonkör', 'Parası olsa bonkör olabilirdi'],
  },
  {
    profile: 'En çok paranı hangi şeye harcarsın?',
    game: 'Arkadaşının en çok para harcadığı şey nedir?',
    type: QuestionType.single_choice,
    choices: ['Teknoloji', 'Giyim / ayakkabı', 'Yeme / içme', 'Diğer'],
  },
  {
    profile: 'Arkadaşının sende en çok sevdiğini düşündüğün özellik nedir?',
    game: 'Sence senin en çok hangi özelliğini sever?',
    type: QuestionType.text,
  },
  {
    profile: 'Arkadaşını en iyi anlatan tek kelime ne olurdu?',
    game: 'Arkadaşının bu soru için yazdığı tek kelime neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Karşı cinsle konuşurken sen mi daha özgüvenlisin, o mu?',
    game: 'Karşı cins ile konuşma konusunda kim daha özgüvenli? (arkadaşının cevabı)',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O (arkadaşın)', 'Eşit', 'İkisi de değil / duruma bağlı'],
  },
];
