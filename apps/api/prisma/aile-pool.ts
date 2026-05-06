import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

/**
 * Aile kategorisi — Masaüstü `sorualarAile.txt` ile uyumlu + özgün sorular.
 * Profil: sen; oyun: diğer aile üyesinin cevabını tahmin.
 */
export const AILE_TYPED_PAIRS: TypedQuestionPair[] = [
  {
    profile: 'Çocukken en çok hangi aile aktivitesini severdin?',
    game: 'Diğer oyuncunun çocukken en sevdiği aile aktivitesi neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'En sevdiğin geleneksel yemek veya tatlı hangisi?',
    game: 'Diğer oyuncunun en sevdiği geleneksel lezzet nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Bayramlarda seni en çok ne heyecanlandırır?',
    game: 'Diğer oyuncuyu bayramda en çok ne heyecanlandırır?',
    type: QuestionType.text,
  },
  {
    profile: 'Aile sohbetlerinde en çok hangi konuya girersin?',
    game: 'Diğer oyuncunun aile sohbetlerinde en çok girdiği konu nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Büyüklerden öğrendiğin en değerli tavsiye (kısaca)?',
    game: 'Diğer oyuncunun söyleyeceği tavsiye hangisi olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Ailede en haz etmediğin akraba / ziyaret tarafı kimler?',
    game: 'Diğer oyuncunun en haz etmediği akraba veya ziyaret tarafı kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Aile içinde en çok kimi gizlice daha çok sevdiğini düşünürsün? (ismi yaz)',
    game: 'Diğer oyuncunun gizlice daha çok sevdiği aile üyesi kimdir?',
    type: QuestionType.text,
  },
  {
    profile: 'Ailede en az anlaşabildiğin kişi kim?',
    game: 'Diğer oyuncunun ailede en az anlaşabildiği kişi kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Küçükken en çok sevdiğin oyuncak neydi?',
    game: 'Diğer oyuncunun küçükken en çok sevdiği oyuncak neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Küçükken büyüyünce ne olmak isterdin?',
    game: 'Diğer oyuncunun küçükken ne olmak istediği neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken en çok hangi abur cuburu yerdin?',
    game: 'Diğer oyuncunun çocukken en çok yediği abur cubur neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Doğumun sezaryen mi, normal doğum mu? (Bilmiyorsan tahmin et.)',
    game: 'Diğer oyuncunun doğumu nasıldı?',
    type: QuestionType.single_choice,
    choices: ['Sezaryen doğum', 'Normal doğum', 'Bilmiyorum / hatırlamıyorum'],
  },
  {
    profile: 'Küçükken ailenle en çok hangi mekâna giderdin? (park, yazlık, AVM…)',
    game: 'Diğer oyuncunun küçükken ailenle favori gittiği mekân neresiydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Hangi akrabanın yanında daha temkinli konuşursun?',
    game: 'Diğer oyuncunun yanında daha temkinli olduğu akraba kim?',
    type: QuestionType.text,
  },
  {
    profile: 'En çok hangi aile büyüğüne benzetilirsin?',
    game: 'Diğer oyuncuyu en çok hangi büyüğe benzetirsiniz?',
    type: QuestionType.text,
  },
  {
    profile: 'Eski günlerden en çok hangi konuyu anlatırsın?',
    game: 'Diğer oyuncunun en çok hangi eski gün konusunu anlattığı nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Anneanne veya babaanne en çok hangi torunu şımartır? (sence)',
    game: 'Diğer oyuncunun en çok şımartılan torun dediği kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Annen (veya ebeveynin) hangi çocuğuna daha çok kıyamaz? (sence)',
    game: 'Diğer oyuncunun ebeveyn kimin yanında yumuşar dediği kim?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Eşit / duruma göre', 'Başka bir kardeş / aile üyesi'],
  },
  {
    profile: 'Misafir geleceği zaman ilk stres olduğun konu ne?',
    game: 'Diğer oyuncunun misafir öncesi ilk stresi ne olur?',
    type: QuestionType.single_choice,
    choices: ['Temizlik / düzen', 'Yemek hazırlığı', 'Alışveriş eksikleri', 'Giyim / görünüm', 'Hepsi biraz'],
  },
  {
    profile: 'En çok hangi ev işini yaparken söylenirsin?',
    game: 'Diğer oyuncunun hangi ev işinde en çok söylendiği nedir?',
    type: QuestionType.single_choice,
    choices: ['Temizlik', 'Yemek pişirme', 'Bulaşık', 'Ütü / çamaşır', 'Başka'],
  },
  {
    profile: 'Sinirlenince en çok tekrar ettiğin cümle veya söz ne?',
    game: 'Diğer oyuncunun sinirlenince en çok söylediği şey nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'En çok kimi eleştirirsin ama onsuz da yapamazsın?',
    game: 'Diğer oyuncunun eleştirir ama vazgeçemez dediği kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Ailede en iyi yemek yapan kişi sence kim?',
    game: 'Diğer oyuncunun en iyi aşçı dediği kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Evde hangi yemeğin kokusu seni en çok çocukluğuna götürür?',
    game: 'Diğer oyuncuyu çocukluğuna götüren yemek kokusu hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken bayramda en çok ne için sabırsızlanırdın?',
    game: 'Diğer oyuncunun çocukken bayramda en çok sabırsızlandığı şey neydi?',
    type: QuestionType.single_choice,
    choices: ['Harçlık / hediye', 'Tatlılar', 'Akraba kalabalığı', 'Yeni kıyafet', 'Oyuna gitmek'],
  },
  {
    profile: 'Ailenle tatile çıksanız ilk tercihin ne olur?',
    game: 'Diğer oyuncunun aile tatili tercihi ne olurdu?',
    type: QuestionType.single_choice,
    choices: ['Deniz / otel', 'Yayla / doğa', 'Şehir turu', 'Evde takılmak', 'Kararsız / her yıl değişir'],
  },
  {
    profile: 'Aile WhatsApp grubunda en çok hangi tablo olur?',
    game: 'Diğer oyuncunun aile grubunda gördüğü tipik tablo hangisi?',
    type: QuestionType.single_choice,
    choices: ['Emoji ve güldük seli', 'Cevapsız mesajlar', 'Fotoğraf / video yağmuru', 'Link paylaşımı', 'Sessizlik'],
  },
  {
    profile: 'Yemek masasında çocukken en çok ne tartışılırdı?',
    game: 'Diğer oyuncunun masada çocukken en çok tartışılan konusu neydi?',
    type: QuestionType.single_choice,
    choices: [
      'Sebzeleri yeme',
      'Telefon / ekran',
      'Televizyon izni',
      'Kim ne kadar yedi',
      'Sofrada konuşulmaz!',
      'Özel bir şey yoktu',
    ],
  },
  {
    profile: 'Gece geç saatte mutfakta en çok kimi yakalarsın?',
    game: 'Diğer oyuncunun gece mutfakta en çok yakaladığı kim?',
    type: QuestionType.single_choice,
    choices: ['Kendimi', 'Annemi', 'Babamı', 'Kardeşimi', 'Kimseyi / fark eder'],
  },
  {
    profile: 'Aile içinde sana takılan en tatlı lakap neydi?',
    game: 'Diğer oyuncunun aile içindeki lakabı neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken evde en çok hangi aile kuralına takılırdın?',
    game: 'Diğer oyuncunun en çok takıldığı ev kuralı hangisiydi?',
    type: QuestionType.single_choice,
    choices: ['Uyku saati', 'Ödev önce', 'Masada telefon yok', 'Ayakkabı düzeni', 'Başka / hatırlamıyorum'],
  },
  {
    profile: 'Ailecek izlenen ilk diziyi / programı hatırlıyor musun? (tür veya isim)',
    game: 'Diğer oyuncunun hep birlikte izlerdik dediği şey neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Büyükler gelince en çok hangi soruyu duyardın?',
    game: 'Diğer oyuncunun akraba sorusu olarak en çok duyduğu neydi?',
    type: QuestionType.single_choice,
    choices: ['Okul nasıl?', 'Kilo almış / vermişsin', 'Ne zaman mezun olacaksın?', 'Evlilik / iş', 'Hiç sormazlardı bile'],
  },
  {
    profile: 'Evde sessizlik bozulduğunda genelde sebep ne?',
    game: 'Diğer oyuncunun evde sessizliği bozan tipik sebep ne?',
    type: QuestionType.single_choice,
    choices: ['Kapı çarpması', 'Kardeş kavgası', 'Telefon zili', 'Patili dost', 'Komşu / dış ses'],
  },
  {
    profile: 'Aile fotoğrafı çekilirken genelde ne olurdu?',
    game: 'Diğer oyuncunun aile fotoğrafı anı nasıl geçerdi?',
    type: QuestionType.single_choice,
    choices: ['Gülüşmeler', 'Biri surat asar', 'On kare sonra olur', 'Geç kaldık telaşı', 'Fotoğraf yoktur bizde'],
  },
  {
    profile: 'Çocukken en çok hangi ev cezasını hatırlarsın?',
    game: 'Diğer oyuncunun çocukken en çok hatırladığı ev cezası ne?',
    type: QuestionType.single_choice,
    choices: ['Odaya gönderilme', 'Televizyon yok', 'Telefon / tablet yok', 'Erken yatma', 'Ceza yoktu / hatırlamıyorum'],
  },
  {
    profile: 'Aile içinde hakemlik gerektiğinde genelde kime danışılırdı?',
    game: 'Diğer oyuncunun evde hakem olarak görüleni kimdi?',
    type: QuestionType.single_choice,
    choices: ['Anne', 'Baba', 'Büyükanne / büyükbaba', 'En büyük kardeş', 'Kimse / tartışma büyürdü'],
  },
  {
    profile: 'Küçükken en çok hangi bayram geleneğini özlersin?',
    game: 'Diğer oyuncunun en çok özlediği bayram geleneği ne?',
    type: QuestionType.single_choice,
    choices: ['El öpme sırası', 'Tatlı sofrası', 'Akraba ziyaret turu', 'Harçlık anı', 'Hepsi karışık'],
  },
  {
    profile: 'Evde kahvaltı sofrasında en çok eksik olan şey neydi? (senin için)',
    game: 'Diğer oyuncunun kahvaltıda en çok aradığı şey neydi?',
    type: QuestionType.single_choice,
    choices: ['Peynir çeşidi', 'Sucuk / pastırma', 'Reçel / bal', 'Çay demi', 'Zaman / herkes bir arada'],
  },
  {
    profile: 'Ailenle en çok hangi şarkıyı veya türküyü mırıldanırdınız?',
    game: 'Diğer oyuncunun ailece mırıldandığı şarkı veya türkü neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken yazın en çok nerede büyüdün? (mahalle, köy, site…)',
    game: 'Diğer oyuncunun çocukluk yazlarını en çok nerede geçirdiği nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Aile içinde parayı en iyi idare eden sence kim?',
    game: 'Diğer oyuncunun en cömert veya en idareli dediği kim?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Anne', 'Baba', 'Başka biri / ortak karar'],
  },
  {
    profile: 'Hastayken seni en çok kim şımartırdı?',
    game: 'Diğer oyuncuyu hastayken en çok kim şımartırdı?',
    type: QuestionType.single_choice,
    choices: ['Anne', 'Baba', 'Büyükanne / büyükbaba', 'Kardeş', 'Kimse şımartmazdı bile'],
  },
  {
    profile: 'Evde en çok hangi koku anne eli değmiş der?',
    game: 'Diğer oyuncunun anne eli dediği koku veya lezzet hangisi?',
    type: QuestionType.text,
  },
  {
    profile: 'Aile içi kavgada barışı ilk kim getirirdi?',
    game: 'Diğer oyuncunun evde barışı ilk getiren kim olduğunu düşünüyor?',
    type: QuestionType.single_choice,
    choices: ['Anne', 'Baba', 'Ben', 'O', 'Susup geçen olurdu'],
  },
  {
    profile: 'Çocukken en çok hangi odayı senin köşen sayardın?',
    game: 'Diğer oyuncunun çocukken en çok sahiplendiği köşe neresiydi?',
    type: QuestionType.single_choice,
    choices: ['Salon koltuğu', 'Kendi odam', 'Balkon', 'Mutfak taburesi', 'Hatırlamıyorum'],
  },
  {
    profile: 'Akraba çocukları gelince en çok ne oynanırdı?',
    game: 'Diğer oyuncunun akraba ziyaretinde en çok oynadığı şey neydi?',
    type: QuestionType.single_choice,
    choices: ['Saklambaç / ev oyunları', 'Video oyunu', 'Dışarı top', 'Kız / erkek ayrı sohbet', 'Oynamazdık pek'],
  },
  {
    profile: 'Aile içinde gizli şampiyon olduğun şey ne? (kimse bilmez sandığın)',
    game: 'Diğer oyuncunun aile içinde gizli güçlü olduğu alan ne?',
    type: QuestionType.text,
  },
];
