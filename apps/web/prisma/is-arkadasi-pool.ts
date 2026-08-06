import { QuestionType } from '@prisma/client';

import { comparisonPair } from './comparison-pair';
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
  comparisonPair('Rakibin', 'Görev paylaşımında “en zor parça” genelde kime kalır?', [
    'Ben',
    'O',
    'Eşit bölüşülür',
    'Gönüllü çıkarız',
    'Yöneticiye sorulur',
  ]),
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
  comparisonPair('Rakibin', 'İş arkadaşınla tartışınca barışı ilk kim getirir?', [
    'Ben',
    'O',
    'Zamanla düzelir',
    'Üçüncü biri',
    'Soğuk savaş',
  ]),

  // ——— 2026-08 genişletme: kariyer geçmişi + ofis dışı kişi ———
  {
    profile: 'Buraya gelmeden önceki işin neydi?',
    game: 'Rakibinin buraya gelmeden önceki işi neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Üniversitede ne okudun?',
    game: 'Rakibi üniversitede ne okudu?',
    type: QuestionType.text,
  },
  {
    profile: 'Hayatındaki ilk iş neydi?',
    game: 'Rakibinin hayatındaki ilk iş neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Kaç dil konuşuyorsun?',
    game: 'Rakibin kaç dil konuşuyor?',
    type: QuestionType.number,
  },
  {
    profile: 'Çalışırken ne dinlersin?',
    game: 'Rakibin çalışırken ne dinler?',
    type: QuestionType.single_choice,
    choices: ['Müzik', 'Podcast', 'Enstrümantal', 'Sessizlik', 'Ofis gürültüsü'],
  },
  {
    profile: 'Hangi kahveyi tercih edersin?',
    game: 'Rakibin hangi kahveyi tercih eder?',
    type: QuestionType.single_choice,
    choices: ['Türk kahvesi', 'Espresso', 'Latte', 'Americano', 'Filtre kahve', 'Kahve içmem'],
  },
  {
    profile: 'Masanda olmazsa olmaz eşyan ne?',
    game: 'Rakibinin masasında olmazsa olmaz eşyası ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Öğle yemeğini nasıl yersin?',
    game: 'Rakibin öğle yemeğini nasıl yer?',
    type: QuestionType.single_choice,
    choices: ['Tek başıma', 'Ekiple', 'Masamda çalışarak', 'Yemek yemem'],
  },
  {
    profile: 'Dört günlük hafta mı, tam uzaktan çalışma mı?',
    game: 'Rakibin dört günlük haftayı mı seçer, tam uzaktan çalışmayı mı?',
    type: QuestionType.single_choice,
    choices: ['Dört günlük hafta', 'Tam uzaktan', 'İkisi de olmasın'],
  },
  {
    profile: 'İşinin en zor tarafı ne?',
    game: 'Rakibinin işinin en zor tarafı ne?',
    type: QuestionType.text,
  },
  {
    profile: 'İşinde bir şeyi değiştirebilsen ne olurdu?',
    game: 'Rakibin işinde bir şeyi değiştirebilse ne olurdu?',
    type: QuestionType.text,
  },
  {
    profile: 'Meslekte örnek aldığın kişi kim?',
    game: 'Rakibinin meslekte örnek aldığı kişi kim?',
    type: QuestionType.text,
  },
  {
    profile: 'Bu işi yapmasan hangi mesleği seçerdin?',
    game: 'Rakibin bu işi yapmasa hangi mesleği seçerdi?',
    type: QuestionType.text,
  },
  {
    profile: 'Hafta sonu hobin ne?',
    game: 'Rakibinin hafta sonu hobisi ne?',
    type: QuestionType.text,
  },
  {
    profile: 'Gitmek istediğin bir sonraki yer neresi?',
    game: 'Rakibinin gitmek istediği bir sonraki yer neresi?',
    type: QuestionType.text,
  },
  {
    profile: 'Ofiste en çok hangi atıştırmalığa uzanırsın?',
    game: 'Rakibin ofiste en çok hangi atıştırmalığa uzanır?',
    type: QuestionType.text,
  },
  {
    profile: 'Çocukken ne olmak istiyordun?',
    game: 'Rakibin çocukken ne olmak istiyordu?',
    type: QuestionType.text,
  },
  {
    profile: 'Okulda en sevdiğin ders hangisiydi?',
    game: 'Rakibinin okulda en sevdiği ders hangisiydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Okulda en zorlandığın ders hangisiydi?',
    game: 'Rakibinin okulda en zorlandığı ders hangisiydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Kariyerindeki en büyük dönüm noktası neydi?',
    game: 'Rakibinin kariyerindeki en büyük dönüm noktası neydi?',
    type: QuestionType.text,
  },
  {
    profile: 'Toplantı için en sevdiğin gün hangisi?',
    game: 'Rakibinin toplantı için en sevdiği gün hangisi?',
    type: QuestionType.single_choice,
    choices: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Hiçbiri'],
  },
  {
    profile: 'Görev almak için gönüllü olur musun, seçilmeyi mi beklersin?',
    game: 'Rakibin görev almak için gönüllü olur mu, seçilmeyi mi bekler?',
    type: QuestionType.single_choice,
    choices: ['Gönüllü olurum', 'Beklerim', 'Duruma göre'],
  },
  {
    profile: 'İş arkadaşlarınla mesai dışı görüşür müsün?',
    game: 'Rakibin iş arkadaşlarıyla mesai dışı görüşür mü?',
    type: QuestionType.single_choice,
    choices: ['Sık sık', 'Ara sıra', 'Nadiren', 'Hiç'],
  },
  {
    profile: 'Emekli olsan ilk ne yapardın?',
    game: 'Rakibin emekli olsa ilk ne yapardı?',
    type: QuestionType.text,
  },
];
