import { QuestionType } from '@prisma/client';

import { comparisonPair } from './comparison-pair';
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
  comparisonPair('Arkadaşın', 'Ortak bir işe girseniz işi kim batırır?', [
    'Ben',
    'O',
    'İkimiz de eşit',
    'Kimse batırmaz',
  ]),
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
  comparisonPair('Arkadaşın', 'Karşı cinsle konuşurken sen mi daha özgüvenlisin, o mu?', [
    'Ben',
    'O',
    'Eşit',
    'İkisi de değil / duruma bağlı',
  ]),

  // ——— 2026-08 genişletme: ortak geçmiş ———
  {
    profile: 'Onunla ilgili ilk izlenimin neydi?',
    game: 'Arkadaşının seninle ilgili ilk izlenimi neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'İkinizle ilgili en komik anınız hangisi?',
    game: 'Arkadaşına göre ikinizin en komik anı hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'Hiç küstünüz mü? Sebebi neydi?',
    game: 'Arkadaşına göre hiç küstünüz mü, sebebi neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Sadece ikinizin anladığı bir espriniz var mı? Ne?',
    game: 'Arkadaşına göre sadece ikinizin anladığı espri ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Beraber tatile çıksanız nereye giderdiniz?',
    game: 'Arkadaşına göre beraber tatile çıksanız nereye giderdiniz?',
    type: QuestionType.text,
  },
  {
    profile: 'Onu üç kelimeyle anlatsan hangileri olurdu?',
    game: 'Arkadaşın seni üç kelimeyle anlatsa hangileri olurdu?',
    type: QuestionType.text,
  },

  // ——— Hanginiz? ———
  comparisonPair('Arkadaşın', 'Daha dışa dönük olan hanginiz?'),
  comparisonPair('Arkadaşın', 'Parayı daha iyi idare eden hanginiz?'),
  comparisonPair('Arkadaşın', 'Daha iyi yemek yapan hanginiz?'),
  comparisonPair('Arkadaşın', 'Daha iyi araba kullanan hanginiz?'),
  comparisonPair('Arkadaşın', 'Daha iyi dans eden hanginiz?'),
  comparisonPair('Arkadaşın', 'Daha çok dedikodu yapan hanginiz?'),
  comparisonPair('Arkadaşın', 'Zombi kıyametinde daha uzun hayatta kalacak olan hanginiz?'),
  comparisonPair('Arkadaşın', 'İkinizden hangisi daha sinir bozucu?'),
  comparisonPair('Arkadaşın', 'Hanginiz daha çok geç kalır?'),
  comparisonPair('Arkadaşın', 'Ünlü olma ihtimali daha yüksek olan hanginiz?'),
  comparisonPair('Arkadaşın', 'Film izlerken ilk uyuyakalan hanginiz?'),

  // ——— Kişisel gerçekler ———
  {
    profile: 'En büyük korkun ne?',
    game: 'Arkadaşının en büyük korkusu ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Gizli yeteneğin ne?',
    game: 'Arkadaşının gizli yeteneği ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Hayalindeki meslek ne?',
    game: 'Arkadaşının hayalindeki meslek ne?',
    type: QuestionType.text,
  },
  {
    profile: 'İlk işin neydi?',
    game: 'Arkadaşının ilk işi neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Hazırlanman ne kadar sürer?',
    game: 'Arkadaşının hazırlanması ne kadar sürer?',
    type: QuestionType.single_choice,
    choices: ['10 dakikadan az', '10–30 dakika', '30–60 dakika', '1 saatten fazla'],
  },
  {
    profile: 'Odanda yılan mı bulmayı tercih edersin, örümcek mi?',
    game: 'Arkadaşın odasında yılan mı bulmayı tercih eder, örümcek mi?',
    type: QuestionType.single_choice,
    choices: ['Yılan', 'Örümcek'],
  },
  {
    profile: 'Rahat kıyafet mi seversin, şık giyinmeyi mi?',
    game: 'Arkadaşın rahat kıyafet mi sever, şık giyinmeyi mi?',
    type: QuestionType.single_choice,
    choices: ['Rahat', 'Şık', 'Duruma göre'],
  },
  {
    profile: 'Dövme yaptırsan ne yaptırırdın?',
    game: 'Arkadaşın dövme yaptırsa ne yaptırırdı?',
    type: QuestionType.text,
  },
  {
    profile: 'En utanç verici anın neydi?',
    game: 'Arkadaşının en utanç verici anı neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Doğum günü hediyesi olarak ne isterdin?',
    game: 'Arkadaşın doğum günü hediyesi olarak ne isterdi?',
    type: QuestionType.text,
  },
];
