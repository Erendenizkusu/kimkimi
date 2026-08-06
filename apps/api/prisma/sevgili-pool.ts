import { QuestionType } from '@prisma/client';

import { comparisonPair } from './comparison-pair';

/** Eski seed’teki Sevgili profil metinleri — yenilerle çakışmasın diye taslaklanır */
export const LEGACY_SEVGILI_PROFILE_PROMPTS: string[] = [
  'En sevdiğin renk?',
  'En sevdiğin yemek?',
  'Planlı mısın, spontane misin? (Kısaca anlat)',
  'Birlikte geçireceğin ideal Pazar günü nasıl olurdu?',
  'Dinlemekten en çok keyif aldığın müzik türü hangisi?',
  'Hayalindeki kısa tatil: deniz mi, şehir mi, doğa mı?',
  'Stres olduğunda sakinleşmek için ne yaparsın?',
  'İlişkide seni en çok mutlu eden küçük jest nedir?',
];

export type TypedQuestionPair = {
  profile: string;
  game: string;
  type: QuestionType;
  /** single_choice / multi_choice için */
  choices?: string[];
};

export const SEVGILI_TYPED_PAIRS: TypedQuestionPair[] = [
  { profile: 'En sevdiğin renk nedir?', game: 'Partnerinin en sevdiği renk nedir?', type: QuestionType.text },
  { profile: 'En sevdiğin yemek nedir?', game: 'Partnerinin en sevdiği yemek nedir?', type: QuestionType.text },
  { profile: 'En sevdiğin tatlı nedir?', game: 'Partnerinin en sevdiği tatlı nedir?', type: QuestionType.text },
  { profile: 'En sevdiğin içecek nedir?', game: 'Partnerinin en sevdiği içecek nedir?', type: QuestionType.text },
  {
    profile: 'En sevdiğin araba markası veya çiçek türü hangisi?',
    game: 'Partnerinin en sevdiği araba markası veya çiçek türü nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin film türü hangisi?',
    game: 'Partnerinin en sevdiği film türü hangisi?',
    type: QuestionType.single_choice,
    choices: ['Aksiyon', 'Komedi', 'Dram', 'Korku', 'Bilim kurgu', 'Romantik', 'Belgesel', 'Animasyon'],
  },
  { profile: 'En sevdiğin dizi hangisi?', game: 'Partnerinin en sevdiği dizi hangisi?', type: QuestionType.text },
  {
    profile: 'En sevdiğin şarkıcı ya da müzik grubu kimdir?',
    game: 'Partnerinin en sevdiği şarkıcı ya da müzik grubu kimdir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin müzik türü nedir?',
    game: 'Partnerinin en sevdiği müzik türü nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin mevsim hangisidir?',
    game: 'Partnerinin en sevdiği mevsim hangisidir?',
    type: QuestionType.single_choice,
    choices: ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'],
  },
  { profile: 'En sevdiğin hayvan nedir?', game: 'Partnerinin en sevdiği hayvan nedir?', type: QuestionType.text },
  {
    profile: 'Sabah insanı mısın, gece insanı mısın?',
    game: 'Partnerin sabah insanı mı, gece insanı mı?',
    type: QuestionType.single_choice,
    choices: ['Sabah insanı', 'Gece insanı'],
  },
  {
    profile: 'Kahveyi mi daha çok seversin, çayı mı?',
    game: 'Partnerin kahveyi mi daha çok sever, çayı mı?',
    type: QuestionType.single_choice,
    choices: ['Kahve', 'Çay'],
  },
  {
    profile: 'Tatilde denizi mi sever, doğayı mı?',
    game: 'Partnerin tatilde denizi mi sever, doğayı mı?',
    type: QuestionType.single_choice,
    choices: ['Deniz', 'Doğa'],
  },
  {
    profile: 'Kalabalık ortamları mı sever, sakin ortamları mı?',
    game: 'Partnerin kalabalık ortamları mı sever, sakin ortamları mı?',
    type: QuestionType.single_choice,
    choices: ['Kalabalık', 'Sakin'],
  },
  {
    profile: 'Sürprizleri mi sever, önceden plan yapmayı mı?',
    game: 'Partnerin sürprizleri mi sever, önceden plan yapmayı mı?',
    type: QuestionType.single_choice,
    choices: ['Sürpriz', 'Plan yapmak'],
  },
  {
    profile: 'Alışverişte hızlı mı karar verirsin, çok mu düşünürsün?',
    game: 'Partnerin alışverişte hızlı mı karar verir, çok mu düşünür?',
    type: QuestionType.single_choice,
    choices: ['Hızlı karar', 'Çok düşünür'],
  },
  {
    profile: 'Üzgün olduğunda yalnız kalmayı mı istersin, konuşmayı mı?',
    game: 'Partnerin üzgün olduğunda yalnız kalmayı mı ister, konuşmayı mı?',
    type: QuestionType.single_choice,
    choices: ['Yalnız kalmak', 'Konuşmak'],
  },
  {
    profile: 'Stresliyken en çok ne yaparsın?',
    game: 'Partnerin stresliyken en çok ne yapar?',
    type: QuestionType.text,
  },
  comparisonPair('Partnerin', 'WhatsApp mesajına kim daha çabuk döner?', [
    'Ben',
    'O',
    'İkimiz de benzer hızda',
  ]),
  {
    profile: 'Doğum günün hangi tarihtedir?',
    game: 'Partnerinin doğum günü hangi tarihtedir?',
    type: QuestionType.date,
  },
  { profile: 'Burcun nedir?', game: 'Partnerinin burcu nedir?', type: QuestionType.text },
  comparisonPair('Partnerin', 'Tartışmadan sonra ilk adım atan kimdir?'),
  {
    profile: 'Kaç kardeşin var?',
    game: 'Partnerinin kaç kardeşi var?',
    type: QuestionType.number,
  },
  {
    profile: 'Doğup büyüdüğün şehir neresi?',
    game: 'Partnerinin doğup büyüdüğü şehir neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken en sevdiğin ders neydi?',
    game: 'Partnerinin çocukken en sevdiği ders neydi?',
    type: QuestionType.single_choice,
    choices: ['Türkçe', 'Matematik', 'Fen bilimleri', 'Sosyal bilgiler', 'Beden eğitimi', 'Müzik', 'Görsel sanatlar', 'Yabancı dil'],
  },
  {
    profile: 'Çocukken olmak istediğin meslek neydi?',
    game: 'Partnerinin çocukken olmak istediği meslek neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Okul hayatında en sevdiğin dönem hangisiydi?',
    game: 'Partnerinin okul hayatında en sevdiği dönem hangisiydi?',
    type: QuestionType.single_choice,
    choices: ['İlkokul', 'Ortaokul', 'Lise', 'Üniversite'],
  },
  {
    profile: 'İlk buluşmanızda ne yaptınız?',
    game: 'Partnerinize göre ilk buluşmanızda ne yaptınız?',
    type: QuestionType.text,
  },
  {
    profile: 'İlişkiye başlama tarihiniz nedir?',
    game: 'Partnerinize göre ilişkiye başlama tarihiniz nedir?',
    type: QuestionType.date,
  },
  comparisonPair('Partnerin', 'İlk “seni seviyorum” diyen kimdi?', [
    'Ben',
    'O',
    'Aynı anda / hatırlamıyoruz',
  ]),
  comparisonPair('Partnerin', 'İlk kavganızda kim haklıydı?', [
    'Ben',
    'O',
    'İkimiz de biraz',
    'Kimse / hatırlamıyoruz',
  ]),
  {
    profile: 'İlk beraber gittiğiniz şehir ya da mekân neresi?',
    game: 'Partnerinize göre ilk beraber gittiğiniz şehir ya da mekân neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'İlk fotoğrafınızı nerede çektiniz?',
    game: 'Partnerinize göre ilk fotoğrafınızı nerede çektiniz?',
    type: QuestionType.text,
  },
  {
    profile: 'En son ona aldığın hediye neydi?',
    game: 'Partnerinin en son sana aldığı hediye neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Özel günlerde büyük jest mi sever, küçük anlamlı şeyler mi?',
    game: 'Partnerin özel günlerde büyük jest mi sever, küçük anlamlı şeyler mi?',
    type: QuestionType.single_choice,
    choices: ['Büyük jest', 'Küçük anlamlı şeyler', 'İkisi de', 'Karışık / duruma göre'],
  },
  {
    profile: 'Sana en çok hangi özelliğin için değer verir?',
    game: 'Partnerin sana en çok hangi özelliğin için değer verir?',
    type: QuestionType.single_choice,
    choices: ['Merhamet', 'Vicdan', 'Dürüstlük', 'Neşe', 'Sabır', 'Güven verme'],
  },
  {
    profile: 'Senin vücudunda en çok nereyi beğenir?',
    game: 'Partnerin senin vücudunda en çok nereyi beğenir?',
    type: QuestionType.text,
  },
  {
    profile: 'İlişkide en hassas olduğu konu nedir?',
    game: 'Partnerinin ilişkide en hassas olduğu konu nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Tartışma sonrası senden nasıl bir yaklaşım bekler?',
    game: 'Partnerin tartışma sonrası senden nasıl bir yaklaşım bekler?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin film hangisi?',
    game: 'Partnerinin en sevdiği film hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'İleride kaç çocuk istiyorsun?',
    game: 'Partnerin ileride kaç çocuk istiyor?',
    type: QuestionType.number,
  },
  {
    profile: 'En çok neye para harcarsın?',
    game: 'Partnerin en çok neye para harcar?',
    type: QuestionType.text,
  },
  {
    profile: 'Hayatında mutlaka yapmak istediğin şey nedir?',
    game: 'Partnerinin hayatında mutlaka yapmak istediği şey nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Hangi ülkede ya da şehirde yaşamak istersin?',
    game: 'Partnerin hangi ülkede ya da şehirde yaşamak ister?',
    type: QuestionType.text,
  },
  {
    profile: 'Solucan olsan da seni sever miydi?',
    game: 'Partnerin “solucan olsan da seni sever miydi?” sorusuna ne derdi?',
    type: QuestionType.single_choice,
    choices: ['Evet', 'Hayır'],
  },

  // ——— 2026-08 genişletme: alışkanlık & komik gözlem ———
  {
    profile: 'Uykuda yaptığın en tuhaf şey nedir?',
    game: 'Partnerinin uykuda yaptığı en tuhaf şey nedir?',
    type: QuestionType.single_choice,
    choices: ['Horlarım', 'Uykumda konuşurum', 'Diş gıcırdatırım', 'Tekme atarım', 'Hiçbiri'],
  },
  comparisonPair('Partnerin', 'Yorganı geceleri kim daha çok kendine çeker?'),
  comparisonPair('Partnerin', 'Geceleri ilk kim uyuyakalır?'),
  comparisonPair('Partnerin', 'Film izlerken ilk uyuyakalan hanginiz?'),
  comparisonPair('Partnerin', 'Evde dağınık olan hanginiz?', ['Ben', 'O', 'İkimiz de']),
  comparisonPair('Partnerin', 'Daha inatçı olan hanginiz?', ['Ben', 'O', 'İkimiz de']),
  comparisonPair('Partnerin', 'Daha rekabetçi olan hanginiz?', ['Ben', 'O', 'İkimiz de']),
  comparisonPair('Partnerin', 'Acıkınca sinirlenen hanginiz?', ['Ben', 'O', 'İkimiz de']),
  comparisonPair('Partnerin', 'Evdeki böceği kim yakalar?', ['Ben', 'O', 'Kimse, kaçarız']),
  comparisonPair('Partnerin', 'Hazırlanması daha uzun süren hanginiz?'),
  comparisonPair('Partnerin', 'Yolda kaybolma ihtimali daha yüksek olan hanginiz?'),
  comparisonPair('Partnerin', 'Hasta olunca daha çok mızmızlanan hanginiz?'),
  comparisonPair('Partnerin', 'İnternetsiz daha uzun dayanabilecek olan hanginiz?'),
  {
    profile: 'En tuhaf alışkanlığın nedir?',
    game: 'Partnerinin en tuhaf alışkanlığı nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Seni en çok sinirlendiren küçük şey nedir?',
    game: 'Partnerini en çok sinirlendiren küçük şey nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Yatarken ne giyersin?',
    game: 'Partnerin yatarken ne giyer?',
    type: QuestionType.single_choice,
    choices: ['Pijama', 'Eşofman', 'Tişört-şort', 'Sadece iç çamaşırı', 'Ne bulursam'],
  },

  // ——— Duygu & ilişki dinamiği ———
  {
    profile: 'Sevgi dilin hangisi?',
    game: 'Partnerinin sevgi dili hangisi?',
    type: QuestionType.single_choice,
    choices: ['Onaylayıcı sözler', 'Kaliteli vakit', 'Hediye', 'Hizmet / yardım', 'Fiziksel temas'],
  },
  {
    profile: 'Fiziksel yakınlık mı, sözlü sevgi ifadesi mi sana daha çok iyi gelir?',
    game: 'Partnerine fiziksel yakınlık mı, sözlü sevgi ifadesi mi daha çok iyi gelir?',
    type: QuestionType.single_choice,
    choices: ['Fiziksel', 'Sözlü', 'İkisi eşit'],
  },
  {
    profile: 'En son ne zaman ağladın?',
    game: 'Partnerin en son ne zaman ağladı?',
    type: QuestionType.text,
  },
  {
    profile: 'Partnerinin yaptığı hangi küçük şey seni her zaman gülümsetir?',
    game: 'Senin yaptığın hangi küçük şey partnerini her zaman gülümsetir?',
    type: QuestionType.text,
  },
  {
    profile: 'İlişkide en çok neye değer verirsin?',
    game: 'Partnerin ilişkide en çok neye değer verir?',
    type: QuestionType.single_choice,
    choices: ['Güven', 'İletişim', 'Sadakat', 'Kahkaha', 'Özgür alan', 'Destek'],
  },

  // ——— Hayaller & “ya olsaydı” ———
  {
    profile: 'Bir süper gücün olsaydı hangisi olurdu?',
    game: 'Partnerinin bir süper gücü olsaydı hangisi olurdu?',
    type: QuestionType.single_choice,
    choices: ['Uçmak', 'Görünmezlik', 'Zaman durdurmak', 'Akıl okumak', 'Işınlanmak'],
  },
  {
    profile: 'Hayran olduğun ünlü kim?',
    game: 'Partnerinin hayran olduğu ünlü kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Piyango kazansan ilk aldığın şey ne olurdu?',
    game: 'Partnerin piyango kazansa ilk ne alırdı?',
    type: QuestionType.text,
  },
  {
    profile: 'Bir hayvan olsaydın hangisi olurdun?',
    game: 'Partnerin bir hayvan olsaydı hangisi olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Zamanda yolculuk yapabilsen hangi döneme giderdin?',
    game: 'Partnerin zamanda yolculuk yapabilse hangi döneme giderdi?',
    type: QuestionType.text,
  },
  {
    profile: 'Kimsenin bilmediği gizli yeteneğin ne?',
    game: 'Partnerinin kimsenin bilmediği gizli yeteneği ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Ölmeden önce mutlaka yapmak istediğin şey ne?',
    game: 'Partnerinin ölmeden önce mutlaka yapmak istediği şey ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Karaokede ilk söyleyeceğin şarkı hangisi?',
    game: 'Partnerinin karaokede ilk söyleyeceği şarkı hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'Bir film çekilse seni hangi oyuncu oynardı?',
    game: 'Bir film çekilse partnerini hangi oyuncu oynardı?',
    type: QuestionType.text,
  },
  {
    profile: 'Issız adaya düşsen yanına tek bir şey alsan ne olurdu?',
    game: 'Partnerin ıssız adaya düşse yanına tek bir şey alsa ne olurdu?',
    type: QuestionType.text,
  },

  // ——— Yakınlık ———
  {
    profile: 'Senin en çok hangi fiziksel özelliğini beğendiğini düşünüyorsun?',
    game: 'Partnerin, en çok hangi fiziksel özelliğini beğendiğini düşünüyor?',
    type: QuestionType.text,
  },
  {
    profile: 'Onun en çekici bulduğun fiziksel özelliği ne?',
    game: 'Partnerinin sende en çekici bulduğu fiziksel özellik ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Öpülmeyi en çok nereden seversin?',
    game: 'Partnerin öpülmeyi en çok nereden sever?',
    type: QuestionType.text,
  },
  comparisonPair('Partnerin', 'İlk öpen kimdi?', ['Ben', 'O', 'Hatırlamıyoruz']),
];
