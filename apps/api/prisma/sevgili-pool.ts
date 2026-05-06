import { QuestionType } from '@prisma/client';

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
  {
    profile: 'WhatsApp mesajına kim daha çabuk döner?',
    game: 'Partnerine göre WhatsApp mesajına kim daha çabuk döner?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'İkimiz de benzer hızda'],
  },
  {
    profile: 'Doğum günün hangi tarihtedir?',
    game: 'Partnerinin doğum günü hangi tarihtedir?',
    type: QuestionType.date,
  },
  { profile: 'Burcun nedir?', game: 'Partnerinin burcu nedir?', type: QuestionType.text },
  {
    profile: 'Tartışmadan sonra ilk adım atan kimdir?',
    game: 'Partnerine göre tartışmadan sonra ilk adım atan kimdir?',
    type: QuestionType.single_choice,
    choices: ['O', 'Ben'],
  },
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
  {
    profile: 'İlk “seni seviyorum” diyen kimdi?',
    game: 'Partnerinize göre ilk “seni seviyorum” diyen kimdi?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Aynı anda / hatırlamıyoruz'],
  },
  {
    profile: 'İlk kavganızda kim haklıydı?',
    game: 'Partnerinize göre ilk kavganızda kim haklıydı?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'İkimiz de biraz', 'Kimse / hatırlamıyoruz'],
  },
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
];
