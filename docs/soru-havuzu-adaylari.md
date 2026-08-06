# KimKimi — Soru Havuzu Genişletme (onaylanmış liste)

Araştırma: 2026-08-06 · Revizyon: 2026-08-06 (sahip incelemesi sonrası)

**Mevcut durum:** 6 kategori / 235 profil-oyun çifti
(sevgili 47 · aile 48 · is-arkadasi 37 · gym-buddy 36 · eglence 34 · arkadas 33).
Her oyunda havuzdan **10 soru** seçiliyor, 3–5'i çoktan seçmeli
(`GAME_ROUND_QUESTION_COUNT`, `pickBalancedGameQuestionIds`).

**Bu revizyonda uygulanan kurallar:**

1. Türkçe sorunun içinde İngilizce terim yok — hepsi Türkçeleştirildi
   (*guilty pleasure, comfort food, pet peeve, cheat meal, meal prep, playlist,
   party trick, bucket list, inside joke, PR* → Türkçe karşılıkları).
2. "Tek cümleyle anlat" tarzı, uzun cevap isteyen sorular çıkarıldı — cevaplar
   birkaç kelimeyle verilebilmeli.
3. Sahip incelemesinde numarası verilen sorular çıkarıldı, açıklamalı verilenler güncellendi.
4. Yakınlık temalı sorular **ana sevgili havuzuna** girdi; ayrı 18+ kategorisi açılmıyor.

**Sonuç: 190 aday → 150 onaylı soru.**

---

## Oyun fazı soru üretimi — iki kural

### Kural A — normal sorular (sahiplik dönüşümü)

| Kategori | Profil → Oyun |
|---|---|
| sevgili | "En sevdiğin renk nedir?" → "**Partnerinin** en sevdiği renk nedir?" |
| arkadas | → "**Arkadaşının** …" |
| aile | → "**Ailenden bu kişinin** …" |
| is-arkadasi | → "**İş arkadaşının** …" |
| eglence | → "**Karşındakinin** …" |
| gym-buddy | → "**Antrenman arkadaşının** …" |

### Kural B — karşılaştırma soruları (şıkları `Ben · O` olanlar) 🆕

"Daha inatçı olan hanginiz?" gibi sorularda sahiplik dönüşümü kafa karıştırıyor —
"Partnerin daha inatçı olan hanginiz?" cümlesi kimin bakış açısından sorulduğunu
belirsiz bırakıyor. Bunun yerine **profil sorusu tırnak içinde aynen alıntılanacak**:

> **Profil:** `Daha inatçı olan hanginiz?` — şıklar: `Ben · O`
> **Oyun:** `Partnerin "Daha inatçı olan hanginiz?" sorusuna ne cevap vermiştir?` — şıklar: `Ben · O`

Şablon: `<Rol>in "<profil sorusu>" sorusuna ne cevap vermiştir?`
(Partnerin / Arkadaşının / Karşındakinin / İş arkadaşının / Antrenman arkadaşının).

Oyun fazındaki `Ben` şıkkı **cevabı veren kişiyi**, `O` şıkkı **tahmin edeni** gösterir —
alıntı sayesinde bu net kalıyor. Aşağıdaki tablolarda Kural B'ye giren sorular 🅑 ile işaretli.

---

## 1. Sevgili — 35 soru (47 → ~82)

### 1a. Alışkanlık & komik gözlem

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| S1 | Uykuda yaptığın en tuhaf şey nedir? | single_choice | Horlarım · Uykumda konuşurum · Diş gıcırdatırım · Tekme atarım · Hiçbiri |
| S2 🅑 | Yorganı geceleri kim daha çok kendine çeker? | single_choice | Ben · O |
| S3 🅑 | Geceleri ilk kim uyuyakalır? | single_choice | Ben · O |
| S4 🅑 | Evde dağınık olan hanginiz? | single_choice | Ben · O · İkimiz de |
| S5 🅑 | Daha inatçı olan hanginiz? | single_choice | Ben · O · İkimiz de |
| S6 🅑 | Daha rekabetçi olan hanginiz? | single_choice | Ben · O · İkimiz de |
| S7 🅑 | Acıkınca sinirlenen hanginiz? | single_choice | Ben · O · İkimiz de |
| S8 🅑 | Evdeki böceği kim yakalar? | single_choice | Ben · O · Kimse, kaçarız |
| S9 🅑 | Hazırlanması daha uzun süren hanginiz? | single_choice | Ben · O |
| S10 🅑 | Yolda kaybolma ihtimali daha yüksek olan hanginiz? | single_choice | Ben · O |
| S11 🅑 | Hasta olunca daha çok mızmızlanan hanginiz? | single_choice | Ben · O |
| S12 🅑 | İnternetsiz daha uzun dayanabilecek olan hanginiz? | single_choice | Ben · O |
| S13 | En tuhaf alışkanlığın nedir? | text | — |
| S14 | Seni en çok sinirlendiren küçük şey nedir? | text | — |
| S17 | Yatarken ne giyersin? | single_choice | Pijama · Eşofman · Tişört-şort · Sadece iç çamaşırı · Ne bulursam |
| S41 🅑 | Film izlerken ilk uyuyakalan hanginiz? | single_choice | Ben · O |

### 1b. Duygu & ilişki dinamiği

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| S18 | Sevgi dilin hangisi? | single_choice | Onaylayıcı sözler · Kaliteli vakit · Hediye · Hizmet/yardım · Fiziksel temas |
| S19 | Fiziksel yakınlık mı, sözlü sevgi ifadesi mi sana daha çok iyi gelir? | single_choice | Fiziksel · Sözlü · İkisi eşit |
| S20 | En son ne zaman ağladın? | text | — |
| S22 | Onun yaptığı hangi küçük şey seni her zaman gülümsetir? | text | — |
| S25 | İlişkide en çok neye değer verirsin? | single_choice | Güven · İletişim · Sadakat · Kahkaha · Özgür alan · Destek |

### 1c. Hayaller & "ya olsaydı"

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| S26 | Bir süper gücün olsaydı hangisi olurdu? | single_choice | Uçmak · Görünmezlik · Zaman durdurmak · Akıl okumak · Işınlanmak |
| S27 | Hayran olduğun ünlü kim? | text | — |
| S28 | Piyango kazansan ilk aldığın şey ne olurdu? | text | — |
| S29 | Bir hayvan olsaydın hangisi olurdun? | text | — |
| S30 | Zamanda yolculuk yapabilsen hangi döneme giderdin? | text | — |
| S31 | Kimsenin bilmediği gizli yeteneğin ne? | text | — |
| S32 | Ölmeden önce mutlaka yapmak istediğin şey ne? | text | — |
| S33 | Karaoke'de ilk söyleyeceğin şarkı hangisi? | text | — |
| S34 | Bir film çekilse seni hangi oyuncu oynardı? | text | — |
| S35 | Issız adaya düşsen yanına tek bir şey alsan ne olurdu? | text | — |

### 1d. Yakınlık *(ana havuza dahil — ayrı kategori yok)*

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| S36 | Senin en çok hangi fiziksel özelliğini beğendiğini düşünüyorsun? | text | — |
| S37 | Onun en çekici bulduğun fiziksel özelliği ne? | text | — |
| S38 | Öpülmeyi en çok nereden seversin? | text | — |
| S39 🅑 | İlk öpen kimdi? | single_choice | Ben · O · Hatırlamıyoruz |

> **Çıkarıldı:** S15 (guilty pleasure), S16 (comfort food), S21, S23, S24, S40.

---

## 2. Arkadaş — 27 soru (33 → ~60)

### 2a. Ortak geçmiş

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| A2 | Onunla ilgili ilk izlenimin neydi? | text | — |
| A3 | İkinizle ilgili en komik anınız hangisi? | text | — |
| A4 | Hiç küstünüz mü? Sebebi neydi? | text | — |
| A5 | Sadece ikinizin anladığı bir espriniz var mı? Ne? | text | — |
| A6 | Beraber tatile çıksanız nereye giderdiniz? | text | — |
| A7 | Onu üç kelimeyle anlatsan hangileri olurdu? | text | — |

### 2b. Hanginiz? *(hepsi Kural B)*

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| A9 🅑 | Daha dışa dönük olan hanginiz? | single_choice | Ben · O |
| A10 🅑 | Parayı daha iyi idare eden hanginiz? | single_choice | Ben · O |
| A11 🅑 | Daha iyi yemek yapan hanginiz? | single_choice | Ben · O |
| A12 🅑 | Daha iyi araba kullanan hanginiz? | single_choice | Ben · O |
| A13 🅑 | Daha iyi dans eden hanginiz? | single_choice | Ben · O |
| A14 🅑 | Daha çok dedikodu yapan hanginiz? | single_choice | Ben · O |
| A15 🅑 | Zombi kıyametinde daha uzun hayatta kalacak olan hanginiz? | single_choice | Ben · O |
| A16 🅑 | İkinizden hangisi daha sinir bozucu? | single_choice | Ben · O |
| A17 🅑 | Hanginiz daha çok geç kalır? | single_choice | Ben · O |
| A36 🅑 | Ünlü olma ihtimali daha yüksek olan hanginiz? | single_choice | Ben · O |
| A37 🅑 | Film izlerken ilk uyuyakalan hanginiz? | single_choice | Ben · O |

### 2c. Kişisel gerçekler

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| A18 | En büyük korkun ne? | text | — |
| A19 | Gizli yeteneğin ne? | text | — |
| A20 | Hayalindeki meslek ne? | text | — |
| A21 | İlk işin neydi? | text | — |
| A27 | Hazırlanman ne kadar sürer? | single_choice | 10 dakikadan az · 10–30 dakika · 30–60 dakika · 1 saatten fazla |
| A30 | Odanda yılan mı bulmayı tercih edersin, örümcek mi? | single_choice | Yılan · Örümcek |
| A31 | Rahat kıyafet mi seversin, şık giyinmeyi mi? | single_choice | Rahat · Şık · Duruma göre |
| A32 | Dövme yaptırsan ne yaptırırdın? | text | — |
| A34 | En utanç verici anın neydi? | text | — |
| A35 | Doğum günü hediyesi olarak ne isterdin? | text | — |

> **Çıkarıldı:** A1 (cümleyle anlat), A8, A22, A23, A24, A25, A26, A28, A29, A33.
> **Eklendi:** A36 (eğlence E12'den kopya), A37 (yeni).

---

## 3. Eğlence & Parti — 26 soru (34 → ~60)

### 3a. Hanginiz? *(hepsi Kural B, şıklar: `Ben · O`)*

| # | Profil sorusu |
|---|---|
| E1 🅑 | Partiden ilk kim ayrılır? |
| E2 🅑 | Partide en çok fotoğraf çeken hanginiz? |
| E3 🅑 | Telefonunu kaybetme ihtimali daha yüksek olan hanginiz? |
| E4 🅑 | Ortamda ilk dans pistine çıkan hanginiz? |
| E5 🅑 | Daha iyi hikâye anlatan hanginiz? |
| E6 🅑 | Gece bitmeden uyuyakalan hanginiz? |
| E7 🅑 | Sır tutma konusunda daha kötü olan hanginiz? |
| E8 🅑 | Yanlış anda gülen hanginiz? |
| E9 🅑 | Toplum içinde utanç verici bir şey yapma ihtimali kimde? |
| E10 🅑 | Bir yarışma programına çıkma ihtimali daha yüksek olan hanginiz? |
| E11 🅑 | Bütün parasını saçma bir şeye harcayacak olan hanginiz? |
| E12 🅑 | Ünlü olma ihtimali daha yüksek olan hanginiz? |
| E13 🅑 | Sabaha kadar ayakta kalabilecek olan hanginiz? |
| E14 🅑 | Karaoke mikrofonunu bırakmayan hanginiz? |
| E15 🅑 | Şoförlüğü üstlenen hanginiz? |
| E16 🅑 | Hesabı ilk isteyen hanginiz? |
| E17 🅑 | Partide tanımadığı biriyle bir saat sohbet edecek olan hanginiz? |
| E18 🅑 | Ertesi gün geceyi hatırlamayan hanginiz? |

### 3b. Eğlence tercihleri

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| E22 | Bir konser bileti kazansan hangi sanatçıya giderdin? | text | — |
| E23 | Gece planı bozulunca B planın ne olur? | text | — |
| E24 | En sevdiğin içecek hangisi? | text | — |
| E25 | Grup fotoğrafında genelde nerede durursun? | single_choice | En önde ortada · Kenarda · Arka sırada · Fotoğrafı ben çekerim |
| E27 | Gece kaçta eve dönmüş olmayı seversin? | single_choice | 00:00'dan önce · 00:00–02:00 · 02:00–04:00 · Güneş doğunca |
| E28 | Grup oyunlarında en iyi olduğun oyun hangisi? | text | — |
| E29 | Bir günlüğüne bir ünlüyle hayat değiştirsen kim olurdun? | text | — |
| E30 | Partiye giderken vazgeçilmezin ne? | text | — |

> **Çıkarıldı:** E19 (party trick), E20, E21, E26. **E12 arkadaş havuzuna da kopyalandı.**

---

## 4. Aile — 26 soru (48 → ~74)

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| F1 | İlk kelimen neydi? | text | — |
| F3 | Ailede en çok kime benzediğin söylenir? | text | — |
| F4 | Okulda en kötü olduğun ders hangisiydi? | single_choice | Matematik · Fen · Türkçe · Sosyal · Yabancı dil · Beden · Resim/Müzik |
| F5 | En sevdiğin öğretmenin kimdi? | text | — |
| F6 | Ehliyeti kaçıncı denemede aldın? | number | — |
| F7 | Hangi ev işinde berbatsın? | single_choice | Bulaşık · Ütü · Yemek · Toz alma · Çamaşır · Hiçbiri |
| F8 | Acil bir durumda ailede ilk kimi ararsın? | text | — |
| F9 | Kriz anında ailede sana en çok kim destek olur? | text | — |
| F10 | Çocukken hayali bir arkadaşın var mıydı? | single_choice | Evet · Hayır · Hatırlamıyorum |
| F11 | Hiç kemiğin kırıldı mı? Hangisi? | text | — |
| F12 | Bilinen bir alerjin var mı? | text | — |
| F15 | Aile büyüklerinden en çok hangi hikâye anlatılır? | text | — |
| F16 | Çocukken seni en çok ne sinirlendirirdi? | text | — |
| F17 | Şu ana kadar en gurur duyduğun şey ne? | text | — |
| F19 | Kararlarını mantığınla mı verirsin, duygularınla mı? | single_choice | Mantık · Duygu · Yarı yarıya |
| F20 | Beş yıl sonra kendini nerede görüyorsun? | text | — |
| F21 | Ailecek en çok hangi bayramı severdiniz? | single_choice | Ramazan Bayramı · Kurban Bayramı · Yılbaşı · Doğum günleri · Hiçbiri |
| F22 | Çocukken evde en çok hangi çizgi filmi izlerdin? | text | — |
| F24 | Ailenle en son ne zaman tatile çıktınız? | text | — |
| F25 | Çocukken en sevdiğin ev yemeği hangisiydi? | text | — |
| F26 | Çocukken en sevmediğin yemek neydi? | text | — |
| F27 | Ailede en iyi araba kullanan kim? | text | — |
| F28 | Aile toplantılarında en çok hangi konu tartışılır? | single_choice | Siyaset · Evlilik/çocuk · Para · Futbol · Komşular · Sağlık |
| F29 | Kaç yaşında ilk kez uçağa bindin? | number | — |
| F30 | Ailede sana en çok kim benzer? | text | — |
| F31 | Ailede hayır demeyi en iyi bilen kim? | text | — |

> **Çıkarıldı:** F2, F13, F14, F18, F23. **Eklendi:** F31.

---

## 5. İş Arkadaşı — 24 soru (37 → ~61)

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| I1 | Buraya gelmeden önceki işin neydi? | text | — |
| I2 | Üniversitede ne okudun? | text | — |
| I3 | Hayatındaki ilk iş neydi? | text | — |
| I4 | Kaç dil konuşuyorsun? | number | — |
| I6 | Çalışırken ne dinlersin? | single_choice | Müzik · Podcast · Enstrümantal · Sessizlik · Ofis gürültüsü |
| I7 | Hangi kahveyi tercih edersin? | single_choice | Türk kahvesi · Espresso · Latte · Americano · Filtre kahve · Kahve içmem |
| I8 | Masanda olmazsa olmaz eşyan ne? | text | — |
| I9 | Öğle yemeğini nasıl yersin? | single_choice | Tek başıma · Ekiple · Masamda çalışarak · Yemek yemem |
| I10 | Dört günlük hafta mı, tam uzaktan çalışma mı? | single_choice | Dört günlük hafta · Tam uzaktan · İkisi de olmasın |
| I11 | İşinin en zor tarafı ne? | text | — |
| I12 | İşinde bir şeyi değiştirebilsen ne olurdu? | text | — |
| I13 | Meslekte örnek aldığın kişi kim? | text | — |
| I14 | Bu işi yapmasan hangi mesleği seçerdin? | text | — |
| I16 | Hafta sonu hobin ne? | text | — |
| I17 | Gitmek istediğin bir sonraki yer neresi? | text | — |
| I21 | Ofiste en çok hangi atıştırmalığa uzanırsın? | text | — |
| I22 | Çocukken ne olmak istiyordun? | text | — |
| I23 | Okulda en sevdiğin ders hangisiydi? | text | — |
| I24 | Okulda en zorlandığın ders hangisiydi? | text | — |
| I25 | Kariyerindeki en büyük dönüm noktası neydi? | text | — |
| I26 | Toplantı için en sevdiğin gün hangisi? | single_choice | Pazartesi · Salı · Çarşamba · Perşembe · Cuma · Hiçbiri |
| I27 | Görev almak için gönüllü olur musun, seçilmeyi mi beklersin? | single_choice | Gönüllü olurum · Beklerim · Duruma göre |
| I28 | İş arkadaşlarınla mesai dışı görüşür müsün? | single_choice | Sık sık · Ara sıra · Nadiren · Hiç |
| I30 | Emekli olsan ilk ne yapardın? | text | — |

> **Çıkarıldı:** I5, I15, I18, I19, I20, I29.

---

## 6. Gym Buddy — 12 soru (36 → ~48)

| # | Profil sorusu | Tip | Şıklar |
|---|---|---|---|
| G2 | Antrenman listendeki bir numaralı şarkı hangisi? | text | — |
| G3 | Kaçamak öğününde ne yersin? | text | — |
| G4 | Günlük protein hedefin kaç gram? | number | — |
| G5 | Haftada kaç gün dinlenirsin? | number | — |
| G6 | Aç karnına mı antrenman yaparsın, yemek yiyip mi? | single_choice | Aç karnına · Yemek yiyip · Fark etmez |
| G7 | Antrenmanda eldiven kullanır mısın? | single_choice | Kullanırım · Kullanmam · Bazen |
| G10 | Takip ettiğin bir spor içerik üreticisi var mı? Kim? | text | — |
| G11 | Şu an hangi rekorun peşindesin? | text | — |
| G12 | Hiç sakatlandın mı? Neresi? | text | — |
| G16 | Antrenmandan sonra ilk ne yaparsın? | single_choice | Protein içerim · Duş · Yemek · Uyurum · İşe/okula giderim |
| G21 | Salonda kiminle çalışmayı seversin? | single_choice | Tek başıma · Partnerle · Grup dersinde · Antrenörle |
| G22 | Tatilde antrenmana devam eder misin? | single_choice | Ederim · Etmem · Hafifletirim |

> **Çıkarıldı:** G1, G8, G9, G13, G14, G15, G17, G18, G19, G20, G23, G24, G25.

---

## Özet

Aşağıdaki rakamlar seed havuzu üzerinde çalıştırılan sayımla doğrulandı
(tekrar eden profil metni yok, şıksız çoktan seçmeli soru yok):

| Kategori | Mevcut | Eklenen | Sonuç | Havuzun MC oranı |
|---|---:|---:|---:|---:|
| Sevgili | 46 | 35 | **81** | %46 |
| Arkadaş | 33 | 27 | **60** | %47 |
| Eğlence & Parti | 34 | 26 | **60** | %63 |
| Aile | 48 | 26 | **74** | %38 |
| İş arkadaşı | 37 | 24 | **61** | %49 |
| Gym Buddy | 36 | 12 | **48** | %52 |
| **Toplam** | **234** | **150** | **384** | — |

Her kategoride MC oranı %38'in üzerinde; `pickBalancedGameQuestionIds` her turda
3–5 çoktan seçmeli soru bulabilir.

---

## Uygulama — tamamlandı ✅

### Adım 1 — Metin cevap kelime sınırı: 2 → 4

Sınır sabit kodlanmıştı; tek sabite çekildi ve 4'e çıkarıldı.

| Dosya | Değişiklik |
|---|---|
| `apps/web/lib/questions.ts` | `MAX_ANSWER_WORDS = 4` eklendi; `needsMaxTwoWords` → `needsShortAnswer` |
| `apps/web/app/oda/[secretId]/RoomClient.tsx` | iki doğrulama + iki uyarı metni sabite bağlandı |
| `apps/web/components/game/QuestionFields.tsx` | girdi placeholder'ı sabite bağlandı |
| `apps/mobile/lib/screens/room_screen.dart` | `kMaxAnswerWords = 4`; iki doğrulama, iki uyarı, iki ipucu metni |

> ⏳ **Açık kalan kontrol:** `apps/api/src/scoring/scoring.service.ts` metin eşleştirmesi
> 4 kelimelik cevaplarda nasıl davranıyor (normalizasyon / benzerlik eşiği)? Sınır
> genişlediği için yanlış-negatif oranı artabilir; ölçülmeli.

### Adım 2 — Kural B altyapısı

`apps/api/prisma/comparison-pair.ts` → `comparisonPair(rakip, profil, şıklar?)`
oyun metnini şablondan üretiyor, 60+ soruda elle yazım hatası riskini sıfırlıyor.

### Adım 3 — Havuz dosyalarına yazım

150 soru ilgili `*-pool.ts` dosyalarına eklendi. `seed.ts` idempotent kaldı.

### Adım 4 — Mevcut havuzda Kural B taraması

Mevcut havuzdaki 12 karşılaştırma sorusu da Kural B'ye çevrildi (sevgili 4, arkadaş 2,
aile 3, iş arkadaşı 2, eğlence 1) — havuzda tek üslup kaldı.

`ensureQuestionPairsForCategory` eşleşmeyi **profil** metnine göre yaptığı için yayındaki
veritabanına yeni oyun metinleri kendiliğinden yansımıyordu; bunun için
`question-comparison-upgrades.ts` + `seed.ts` içinde ayrı bir yükseltme adımı yazıldı
(eski oyun metnini bulup yenisiyle değiştirir, şıkları düzeltir, idempotenttir).

### Doğrulama

- `apps/web` → `tsc --noEmit` temiz
- `apps/api/prisma` → `tsc --noEmit` temiz
- `apps/mobile` → `flutter analyze` temiz (`No issues found!`)
- Havuz sayımı → 384 çift, tekrar eden profil metni yok, şıksız MC yok

---

## Kaynaklar

**Türkçe**
- [Düşünce Kataloğu — Kim Daha Oyunu Soruları (300+)](https://dusuncekatalogu.com/kim-daha-oyunu-sorulari/)
- [PsyCat Games — Kim Beni Daha İyi Tanıyor? (100+ soru, TR)](https://psycatgames.com/magazine/conversation-starters/who-knows-me-better-questions/)
- [AhaSlides — Beni Kim Daha İyi Tanıyor, 121 soru (TR)](https://ahaslides.com/blog/who-knows-me-better-questions/)
- [Sabah — Kim Daha Soruları](https://www.sabah.com.tr/yasam/kim-daha-sorulari-sevgiliye-ve-arkadasa-sorulacak-komik-eglenceli-farkli-kim-daha-oyunu-sorulari-st1-6439693)

**İngilizce**
- [The Knot — 62 Best "How Well Do You Know Me" Questions](https://www.theknot.com/content/how-well-do-you-know-me-questions)
- [Green Wedding Shoes — 75 Newlywed Game Questions](https://greenweddingshoes.com/best-newlywed-game-questions/)
- [Questions About Everything — 141 Best Friend Quiz Questions](https://questionsabouteverything.com/best-friend-quiz-questions/)
- [Questions About Everything — 122 Family Questions](https://questionsabouteverything.com/how-well-do-you-know-me-questions-for-family/)
- [Bar None Games — 49 Coworker Trivia Questions](https://barnonegames.com/blog/49-coworker-trivia-questions)
- [Who's Most Likely — Fitness Frenzy (gym buddy)](https://whosmostlikely.com/fitness-frenzy-whos-most-likely-to-questions-challenge-for-gym-buddies/)
