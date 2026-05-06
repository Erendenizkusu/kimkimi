import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

/**
 * Eğlence & Parti — profil: sen; oyun: rakibinin cevabı.
 * (Metin + çoktan seçmeli karışık; serbest metinler `question-open-text-prompts` ile sabitlenir.)
 */
export const EGLENCE_TYPED_PAIRS: TypedQuestionPair[] = [
  {
    profile: 'Bir partide ilk 10 dakikada genelde ne yaparsın? (tanış, dans et, kenarda izle…)',
    game: 'Rakibinin partide ilk 10 dakikada yaptığı şey nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin masa / grup oyunu hangisi?',
    game: 'Rakibinin en sevdiği grup oyunu nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Karaoke yapsan ilk söyleyeceğin şarkı türü veya örnek?',
    game: 'Rakibinin karaoke seçimi ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: '\u201cBu mu şu mu\u201d: yaz mı doğa mı?',
    game: 'Rakibin yaz mı doğa mı seçerdi?',
    type: QuestionType.single_choice,
    choices: ['Yaz', 'Doğa'],
  },
  {
    profile: 'Komedi mi dram mı? (Film/dizi tercihi)',
    game: 'Rakibinin komedi mi dram mı tercihi nedir?',
    type: QuestionType.single_choice,
    choices: ['Komedi', 'Dram'],
  },
  {
    profile: 'Bir günlüğüne ünlü biriyle takas sansın; kim olurdu?',
    game: 'Rakibinin bir günlük takas seçeceği ünlü kim olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Ev / doğum günü partisinde en çok hangi görevi üstlenirsin?',
    game: 'Rakibinin partide en çok hangi görevi üstlendiği nedir?',
    type: QuestionType.single_choice,
    choices: ['Müzik / liste', 'Yemek-içecek', 'Oyun organize etmek', 'Misafir ağırlama', 'Fotoğraf / anı'],
  },
  {
    profile: 'Dans pistine ne zaman çıkarsın?',
    game: 'Rakibinin dans pistine çıkma tarzı nedir?',
    type: QuestionType.single_choice,
    choices: ['İlk şarkıda', 'Alkol / ortam ısınınca', 'Zorla çekilince', 'Çıkmam / kenardan'],
  },
  {
    profile: 'Partide en çok hangi içecek seni temsil eder?',
    game: 'Rakibinin partideki imza içeceği ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Gece çıkışında eve dönerken tercihin ne?',
    game: 'Rakibinin gece dönüş tercihi nedir?',
    type: QuestionType.single_choice,
    choices: ['Toplu taşıma', 'Taksi / araç', 'Yürüyüş', 'Kalırım sabaha', 'Duruma göre'],
  },
  {
    profile: 'Konserde veya canlı müzikte nerede durmayı seversin?',
    game: 'Rakibinin konserde tercih ettiği yer neresi?',
    type: QuestionType.single_choice,
    choices: ['Ön sıra', 'Orta', 'Kenar / çıkış yakını', 'Balkon / oturmalı', 'Hiç gitmem'],
  },
  {
    profile: 'Bir ice breaker sorun olsa ilk ne sorardın?',
    game: 'Rakibinin tanışmayı açacağı soru ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Partide fotoğraf çekmek: sen mi çekersin poz mu verirsin?',
    game: 'Rakibinin partide fotoğraf rolü nedir?',
    type: QuestionType.single_choice,
    choices: ['Ben çekerim', 'Poz veririm', 'İkisi de', 'Kaçarım kareden'],
  },
  {
    profile: 'En unutulmaz parti anını tek cümleyle anlatsan?',
    game: 'Rakibinin anlatacağı unutulmaz parti anı ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Akşam eğlencesi: board game gecesi mi, dans / kulüp mü?',
    game: 'Rakibinin ideal akşam eğlencesi hangisi?',
    type: QuestionType.single_choice,
    choices: ['Board game / ev partisi', 'Dans / kulüp', 'Bar / oturarak', 'Evde film', 'Hepsi olur'],
  },
  {
    profile: 'Misafir olarak partiye geç kalınca içinden ilk geçen cümle ne?',
    game: 'Rakibinin geç kalınca içinden geçen tipik cümle ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Parti müziğinde en çok hangi tür açılır?',
    game: 'Rakibinin playlistinde en çok hangi tür açılır?',
    type: QuestionType.single_choice,
    choices: ['Pop', 'Rap / hip hop', 'Rock / alternatif', 'Arabesk / fantezi', 'Karışık playlist'],
  },
  {
    profile: 'Doğum günü pastasından önce aklından geçen şey ne?',
    game: 'Rakibinin pasta anında aklından geçen şey ne?',
    type: QuestionType.single_choice,
    choices: ['Dilek', 'Fotoğraf', 'Utanma', 'Pastanın tadı', 'Hediye merakı'],
  },
  {
    profile: 'Kostümlü / tema partisinde en çok ne olurdun?',
    game: 'Rakibinin kostümlü partide rolü ne olurdu?',
    type: QuestionType.single_choice,
    choices: ['Full kostüm', 'Minimal aksesuar', 'Organizatör', 'İzleyici', 'Katılmam'],
  },
  {
    profile: 'Partide en çok hangi yemeği ararsın?',
    game: 'Rakibinin partide en çok aradığı atıştırmalık ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Grup oyununda haksızlık olunca tepkin ne olur?',
    game: 'Rakibinin grup oyununda haksızlıkta tepkisi ne?',
    type: QuestionType.single_choice,
    choices: ['Gülüp geçerim', 'Kuralı hatırlatırım', 'Sinirlenirim', 'Oyunu bırakırım', 'Hakemlik yaparım'],
  },
  {
    profile: 'After partisi dediğinde aklına gelen ilk şey ne?',
    game: 'Rakibinin “after” dediğinde çağrıştırdığı şey ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Düğün veya kına gibi kalabalıkta en çok nerede olursun?',
    game: 'Rakibinin kalabalık düğün/kınada yeri neresi?',
    type: QuestionType.single_choice,
    choices: ['Pistte', 'Masada sohbet', 'Servis sırası', 'Teras / hava', 'Erken kaçış planı'],
  },
  {
    profile: 'Partide telefonunu en çok ne için kullanırsın?',
    game: 'Rakibinin partide telefonu ne için kullandığı?',
    type: QuestionType.single_choice,
    choices: ['Story / fotoğraf', 'Mesaj', 'Taksi çağırmak', 'Şarj / uçak modu', 'Az kullanırım'],
  },
  {
    profile: 'En sevdiğin parti teması veya dekor fikrin ne? (kısaca)',
    game: 'Rakibinin seçeceği parti teması ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Yılbaşı gecesi için tek kelimeyle modun ne?',
    game: 'Rakibinin yılbaşı modunu tek kelimeyle nasıl tarif edersin?',
    type: QuestionType.text,
  },
  {
    profile: 'Partide tanımadığın biriyle sohbeti kim başlatır?',
    game: 'Rakibinin tanımadığı biriyle sohbeti kim başlatır?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Üçüncü biri', 'Kimse / utangaç kalırız'],
  },
  {
    profile: 'Piknik veya bahçe partisinde vazgeçilmezin ne?',
    game: 'Rakibinin açık hava partisinde vazgeçilmezi ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Kahkaha atmadan edemediğin parti oyunu veya aktivite hangisi?',
    game: 'Rakibini en çok güldüren parti aktivitesi ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Parti sonrası ertesi gün “recovery” planın ne?',
    game: 'Rakibinin ertesi gün toparlanma planı ne?',
    type: QuestionType.single_choice,
    choices: ['Uyku maratonu', 'Kahvaltı buluşması', 'Spor / yürüyüş', 'Çalışırım normal', 'Netflix'],
  },
  {
    profile: 'Tek başına evde “parti modu” açsan ilk ne yaparsın?',
    game: 'Rakibinin evde solo parti modunda yaptığı şey ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Partide en çok hangi hatayı yaparsın? (samimi)',
    game: 'Rakibinin partide en çok yaptığı “klasik hata” ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Canlı müzik yerine DJ seti mi tercih edersin?',
    game: 'Rakibin canlı müzik mi DJ seti mi sever?',
    type: QuestionType.single_choice,
    choices: ['Canlı müzik', 'DJ seti', 'İkisi de', 'Sessiz sohbet daha iyi'],
  },
  {
    profile: 'Parti davetiyesinde “dress code” yazsa en çok ne giyersin?',
    game: 'Rakibinin dress code’a uyumu nasıl olur?',
    type: QuestionType.single_choice,
    choices: ['Tam uyarım', 'Yorumlarım', 'Umursamam', 'Son dakika panik', 'Aşırı yaparım'],
  },
];
