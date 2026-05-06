import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

/**
 * İş arkadaşı — profil: sen; oyun: rakibinin cevabı.
 */
export const IS_ARKADASI_TYPED_PAIRS: TypedQuestionPair[] = [
  {
    profile: 'Toplantı öncesi hazırlanmayı sever misin? Nasıl yaparsın?',
    game: 'Rakibinin toplantı öncesi hazırlık alışkanlığı nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'İş gününde enerjini en çok ne yükseltir?',
    game: 'Rakibinin iş gününde enerjisini ne yükseltir?',
    type: QuestionType.text,
  },
  {
    profile: 'Uzaktan mı ofisten mi verimli hissedersin?',
    game: 'Rakibin uzaktan mı ofisten mi daha verimli?',
    type: QuestionType.single_choice,
    choices: ['Uzaktan', 'Ofisten'],
  },
  {
    profile: 'Takımda genelde hangi rolde parlıyorsun? (fikir, detay, sunum, koordinasyon)',
    game: 'Rakibinin takımdaki güçlü rolü nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Stresli deadline\u2019da ilk tepkin ne olur?',
    game: 'Rakibinin deadline stresindeki ilk tepkisi nedir?',
    type: QuestionType.text,
  },
  {
    profile: 'Slack / Teams bildirimi üst üste gelince ilk tepkin ne?',
    game: 'Rakibinin bildirim yağmurundaki ilk tepkisi ne?',
    type: QuestionType.single_choice,
    choices: ['Önceliklendiririm', 'Sessize alırım', 'Paniklerim', 'Hemen cevaplarım', 'Görmezden kalırım'],
  },
  {
    profile: 'Öğle arasını tek başına mı geçirirsin, ekip ile mi?',
    game: 'Rakibinin öğle arası tercihi ne?',
    type: QuestionType.single_choice,
    choices: ['Tek başıma', 'Ekip ile', 'İkisi karışık', 'Öğle arası yok / atlarım'],
  },
  {
    profile: 'Video toplantıda kameran genelde ne durumda?',
    game: 'Rakibinin toplantıdaki kamera alışkanlığı ne?',
    type: QuestionType.single_choice,
    choices: ['Açık', 'Kapalı', 'Duruma göre', 'Ses açık görüntü yok'],
  },
  {
    profile: 'İş yerinde seni en çok rahatlatan küçük şey ne?',
    game: 'Rakibini işte en çok rahatlatan küçük şey ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Mesai sonrası ilk saatte genelde ne yaparsın?',
    game: 'Rakibinin iş çıkışı ilk rutini ne?',
    type: QuestionType.single_choice,
    choices: ['Eve çekilirim', 'Spor / yürüyüş', 'Sosyalleşme', 'İkinci mesai / proje', 'Trafiği beklerim'],
  },
  {
    profile: 'Ofis mutfağında kahve mi çay mı?',
    game: 'Rakibinin ofis mutfağı tercihi ne?',
    type: QuestionType.single_choice,
    choices: ['Kahve', 'Çay', 'İkisi de', 'Su / başka'],
  },
  {
    profile: 'Patron veya yöneticiyle tek başına asansörde kalsan ilk konun ne olur?',
    game: 'Rakibinin asansör sohbetinde açacağı konu ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Hibrit çalışsak haftada kaç gün ofiste olmak isterdin?',
    game: 'Rakibinin ideal ofis günü sayısı kaç?',
    type: QuestionType.single_choice,
    choices: ['0', '1–2', '3', '4–5', 'Fark etmez'],
  },
  {
    profile: 'Bu maili kim yazdı? dediğinde en çok kime bakarsın?',
    game: 'Rakibinin mail konusunda ilk danıştığı kim olur?',
    type: QuestionType.single_choice,
    choices: ['Kendi kendime', 'Güvenilir iş arkadaşı', 'Yönetici', 'IT / destek', 'Google'],
  },
  {
    profile: 'Sunum öncesi son 5 dakikada ne yaparsın?',
    game: 'Rakibinin sunum öncesi son 5 dakikası nasıl geçer?',
    type: QuestionType.single_choice,
    choices: ['Slayt kontrol', 'Derin nefes', 'Kahve', 'Panik revizyon', 'Soğukkanlı beklerim'],
  },
  {
    profile: 'İşyerinde duyduğun en absürt rivayı kısaca anlatsan?',
    game: 'Rakibinin anlatacağı ofis rivayı ne tür olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Deadline kaçarsa haberi nasıl verirsin?',
    game: 'Rakibinin gecikme haberini verme tarzı ne?',
    type: QuestionType.single_choice,
    choices: ['Erken ve net', 'Son dakika', 'Önce çözüm sonra haber', 'Kaçınırım', 'Hiç kaçırmam'],
  },
  {
    profile: 'Pair programming / beraber çalışma senin için nasıl?',
    game: 'Rakibinin beraber çalışma tercihi ne?',
    type: QuestionType.single_choice,
    choices: ['Severim', 'Nadiren iyi', 'Yorucu', 'Hiç denemedim / bilmem', 'Duruma göre'],
  },
  {
    profile: 'İş yemeklerinde en çok hangi masayı seçersin?',
    game: 'Rakibinin iş yemeğinde masa tercihi ne?',
    type: QuestionType.single_choice,
    choices: ['Yönetici yakını', 'Ekip ortası', 'Kenar sessiz', 'Pencerenin önü', 'Ayaküstü'],
  },
  {
    profile: 'Ofiste en çok hangi ses seni çıldırtır?',
    game: 'Rakibini ofiste en çok rahatsız eden ses ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Yıllık izin planını ne zaman yapmaya başlarsın?',
    game: 'Rakibinin izin planlama tarzı ne?',
    type: QuestionType.single_choice,
    choices: ['Yıl başı', 'Son dakika', 'Kampanya / indirim', 'İş yoğunluğuna göre', 'Planlamam'],
  },
  {
    profile: 'Retro / değerlendirme toplantılarında rolün ne?',
    game: 'Rakibinin retro toplantısındaki rolü ne?',
    type: QuestionType.single_choice,
    choices: ['Not alırım', 'Konuşurum', 'Sessiz gözlem', 'Mizah yaparım', 'Katılmaktan kaçarım'],
  },
  {
    profile: 'İş arkadaşına doğum günü için en çok ne alırsın?',
    game: 'Rakibinin iş arkadaşı hediye tarzı ne?',
    type: QuestionType.single_choice,
    choices: ['Kurumsal hediye', 'Kişisel küçük şey', 'Kek / pasta', 'Unuturum / hatırlatırım', 'Grup koleksiyonu'],
  },
  {
    profile: '“Bugün evden çalışıyorum” dediğinde gerçekten nerede olmak isterdin?',
    game: 'Rakibinin ideal home office ortamı ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Kariyerinde seni en çok gururlandıran küçük an ne?',
    game: 'Rakibinin gururla anlatacağı küçük iş anı ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Toplantı 30 dk uzarsa içinden geçen ilk şey ne?',
    game: 'Rakibinin uzayan toplantıdaki iç sesi ne?',
    type: QuestionType.single_choice,
    choices: ['Sabır', 'Açlık', 'Mail bekliyor', 'Gereksiz derim', 'Sorun yok'],
  },
  {
    profile: 'Ofis kliması / sıcaklık konusunda tarafın ne?',
    game: 'Rakibinin klima tarafı ne?',
    type: QuestionType.single_choice,
    choices: ['Daha soğuk', 'Daha sıcak', 'Standart iyidir', 'Pencere açalım', 'Umursamam'],
  },
  {
    profile: 'İşe yeni biri başlayınca ona ilk tavsiyen ne olurdu?',
    game: 'Rakibinin yeni başlayana ilk tavsiyesi ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Cuma öğleden sonra motivasyonun nasıl olur?',
    game: 'Rakibinin cuma öğlesi motivasyonu ne?',
    type: QuestionType.single_choice,
    choices: ['Düşer', 'Aynı kalır', 'Artar bitireyim diye', 'Zaten hafif gün', 'Cuma yok sayılır'],
  },
  {
    profile: 'İş WhatsApp / grup yazışmasında genelde ne yaparsın?',
    game: 'Rakibinin iş grubundaki tarzı ne?',
    type: QuestionType.single_choice,
    choices: ['Emoji ile katılırım', 'Sadece okurum', 'Hızlı cevap', 'Sessize alırım', 'Gruptan çıkmak isterim'],
  },
  {
    profile: 'Networking etkinliğinde ilk 10 dakikada ne yaparsın?',
    game: 'Rakibinin networking açılışı ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Görev paylaşımında “en zor parça” genelde kime kalır?',
    game: 'Rakibinin görev paylaşımında zor parça kime kalır?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Eşit bölüşülür', 'Gönüllü çıkarız', 'Yöneticiye sorulur'],
  },
  {
    profile: 'İş çıkışı toplu taşımada en çok ne yaparsın?',
    game: 'Rakibinin iş çıkışı yolculukta yaptığı şey ne?',
    type: QuestionType.single_choice,
    choices: ['Müzik / podcast', 'Mail temizliği', 'Uyuklarım', 'Kitap', 'Sohbet'],
  },
  {
    profile: 'Ofiste doğum günü kutlaması olunca tepkin ne?',
    game: 'Rakibinin ofis doğum günü kutlamasındaki tepkisi ne?',
    type: QuestionType.single_choice,
    choices: ['Mutlu olurum', 'Utanırım', 'Pastayı severim', 'Kaçınırım', 'Nötr'],
  },
  {
    profile: 'Tek kelimeyle iş yerindeki “görünmez süper gücün” ne?',
    game: 'Rakibinin iş yerindeki gizli süper gücü ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Yöneticine kötü haber verirken stratejin ne?',
    game: 'Rakibinin kötü haber verme stratejisi ne?',
    type: QuestionType.text,
  },
  {
    profile: 'İş arkadaşınla tartışınca barışı ilk kim getirir?',
    game: 'Rakibinin iş tartışmasında barışı kim getirir?',
    type: QuestionType.single_choice,
    choices: ['Ben', 'O', 'Zamanla düzelir', 'Üçüncü biri', 'Soğuk savaş'],
  },
];
