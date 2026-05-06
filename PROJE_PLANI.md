# Kim Kimi Ne Kadar Tanıyor — Proje Planı

**Mobil istemci:** Flutter (iOS + Android)  
**Kamu web sitesi:** Next.js (pazarlama, SEO, mağaza yönlendirme; isteğe bağlı tarayıcıdan oyun)  
**API:** NestJS (REST + WebSocket)  
**Veritabanı:** PostgreSQL (Docker ile lokal ve dağıtım)  
**Yönetim paneli:** Next.js (`apps/admin` — kategori, soru, içerik yönetimi)  
**Tür:** İki kişilik, kategoriye göre soru havuzu, eş zamanlı ekranlar, puanlı bilgi yarışması  

**Belge sürümü:** 3.0  
**Tarih:** 12 Nisan 2026  

---

## 1. Özet ve vizyon

İki kullanıcı (aynı mekânda veya uzaktan) bir **kategori** seçer; her biri önce **kendisi hakkında** soruları cevaplar (doğru cevap havuzu oluşur). Ardından **oyun** aşamasında aynı sorular karşılıklı sorulur; her iki taraf da cevap verene kadar tur ilerlemez. Tur sonunda doğru/yanlış ve **kim kimi daha çok tanıyor** skoru gösterilir.

**Teknik özet:** Kalıcı veri ve iş kuralları **PostgreSQL** üzerinde; **Flutter** ve (isteğe bağlı aşamada) **web oyuncu arayüzü** ile **NestJS** REST/WebSocket konuşur; içerik **admin**’den, marka ve keşfedilebilirlik **kamu web** projesinden yürür.

**Temel değer önerisi:** Sosyal bağ kuran, oda kodu veya QR ile hızlı başlayan deneyim; **web** tarafı ile arama motorları ve paylaşım linkleri üzerinden organik görünürlük, mağaza indirmeye köprü ve güven (gizlilik / iletişim sayfaları).

---

## 2. Pazar ve ilham (web araştırması özeti)

| Ürün / yaklaşım | Öne çıkan noktalar | Bizim için ders |
|-----------------|-------------------|-----------------|
| **QuizTogether** | WebSocket ile anlık senkron; oda; kategoriler | İki cihazda “aynı tur” için WS + sunucu tarafı otorite şart |
| **Couple Game / CouplesQuiz** | Konu setleri, skor, tahmin | Admin’den soru seti yönetimi iş modeline uyuyor |
| **PartyMind tarzı** | Oda kodu, hızlı başlangıç | Kısa kod + güvenli uzun `roomId` ayrımı düşünülebilir |

### 2.1 Seçilen yığınla ilgili araştırma notları

| Konu | Bulgu | Pratik karar |
|------|--------|----------------|
| **NestJS + Socket.io** | `@nestjs/websockets`, `@nestjs/platform-socket.io`; `join` / `to(room).emit()` ile oda yayını | Oyun lobisi ve tur güncellemeleri için **WebSocket Gateway**; olay adları sürümlenir |
| **Ölçek (çok sunucu)** | Çok instance için **Redis adapter** (pub/sub) | MVP tek container yeterli; trafik artınca **Redis** |
| **PostgreSQL + Docker** | **İsimli volume**, **healthcheck**, `depends_on: service_healthy` | `docker-compose` içinde `postgres` (+ ileride `redis`); Windows’ta DB için bind mount yerine named volume |
| **Next.js admin + NestJS** | JWT + rol; **httpOnly cookie**; CORS kısıtı; refresh token | Admin yalnızca `ROLE_ADMIN`; mobil ve web için ayrı origin’ler whitelist |
| **Kamu web (Next.js)** | Pazarlama + uygulama aynı Next kod tabanında: **SSR/SSG ile SEO**, tek deploy hattı yaygın pratik | `apps/web`: landing, hukuki sayfalar, blog/SSG; performans ve meta etiketleri |
| **Turborepo / monorepo** | `web/` + `admin/` + paylaşılan `ui` / `api-client` paketleri; önbellekli paralel build | Tek repoda `apps/web` ve `apps/admin`; ortak **OpenAPI türetilmiş istemci** veya `packages/api-client` |
| **Flutter Web vs ayrı web** | Flutter Web: tek UI kodu; fakat **SEO ve ilk yük** açısından içerik ağırlıklı pazarlama sayfaları için zayıf taraf sık vurgulanır. DOM tabanlı Next, içerik ve arama için daha uygun | **Pazarlama ve hukuki site → Next (`apps/web`)**. Tam oyunu tarayıcıda açmak istenirse: **Next + socket.io-client** (veya ileride Flutter Web yalnızca `/oyna` PWA denemesi) |

**Sonuç:** Ürün farkı **Türkçe içerik**, **kategori netliği**, **gizlilik** ve **web’de görünür olma**; teknik fark Postgres + Nest + **iki Next uygulaması** (kamu + admin) + Flutter mobil.

---

## 3. Hedef kitle ve senaryolar

- **Sevgili / eş:** İlişki tarihi, tercihler; admin’de içerik tonu etiketleri (ör. `romantic`, `deep`).
- **Arkadaş:** Hobiler, müzik, rekabetçi skor.
- **Gym buddy:** Antrenman, hedefler, hafif mizah.

**Kullanım:** Kafe, ev, salon; uzaktan aynı oda kodu. **Web:** Kampanya sayfası paylaşımı, “nasıl oynanır”, mağaza linkleri; (faz 2) misafirin uygulama indirmeden tarayıcıdan katılması.

---

## 4. Fonksiyonel gereksinimler

### 4.1 MVP (öneri)

1. **Kategori:** En az 4 kategori; sorular **Postgres**’te; **Flutter** API’den çeker.
2. **Oda oluştur / katıl:** Host oda açar; misafir **kısa kod** veya **QR** (QR içinde `https://…/katil?kod=XXXX` gibi **web kök domain** kullanılabilir — deep link veya mağaza yönlendirmesi ile birleştirilir).
3. **Aşama A — Profil:** “Hakkımda” soruları; cevaplar DB’ye yazılır; her iki oyuncu tamamlayınca aşama biter.
4. **Aşama B — Oyun:** Soru sırası sunucuda; **her iki cevap** kaydedilene kadar `current_question_index` artmaz; istemciler WS ile güncellenir.
5. **Sonuç:** Doğru/yanlış, yüzde / puan özeti.
6. **Admin MVP:** Kategori CRUD, soru CRUD, yayınlama (taslak / yayında).
7. **Kamu web MVP (`apps/web`):** Ana sayfa (ürün tanımı), **nasıl oynanır**, **App Store / Google Play** butonları, **gizlilik politikası** ve **kullanım şartları** (KVKK için zemin), iletişim veya sosyal linkler; temel **SEO** (`metadata`, `sitemap.xml`, `robots.txt`).

### 4.2 Sonraki sürümler

- **Web — tarayıcıdan oyun:** `/oyna` veya `play.` alt alan adı; Nest REST + **socket.io-client** ile Flutter’daki oda akışının web karşılığı (profil + oyun + sonuç). İsteğe bağlı **PWA** (ana ekrana ekle).
- Oyuncu hesabı, geçmiş oyunlar.
- Redis adapter + yatay ölçekleme.
- Blog / SSS (SSG veya MD tabanlı içerik).
- Moderasyon, toplu içe aktarma, analytics (admin).

---

## 5. Kullanıcı akışları

### 5.1 Host (Flutter)

```
Aç → Kategori seç → POST /rooms → WS connect → lobby
→ Profil cevapları (REST) → WS: her iki profil tamam → Oyun (REST + WS) → Sonuç
```

### 5.2 Misafir (Flutter)

```
Aç → Katıl → Kod → POST /rooms/:code/join → aynı akış
```

### 5.3 Web ziyaretçisi (MVP — yalnızca kamu site)

```
Arama / paylaşılan link → Ana sayfa veya “Nasıl oynanır”
→ Mağaza linki ile uygulama indirme veya QR sayfası açıklaması
```

### 5.4 Web oyuncu (MVP+ — tarayıcıdan oyun)

```
/katil veya /oyna → Kod gir → Nest ile join + WS
→ Profil ve oyun ekranları (React); sonuç sayfası
```

**Kural:** `category_id` oda satırında sabitlenir (tüm istemci türlerinde aynı API sözleşmesi).

---

## 6. Soru havuzu ve puanlama

### 6.1 İçerik modeli (Postgres ile uyumlu)

- Soru alanları: `id`, `category_id`, `phase` (`profile` | `game`), `type`, `prompt`, `choices_json`, `order_index`, `weight`, `status` (draft | published), `maps_to_question_id`.

### 6.2 Puanlama

- MVP: tam eşleşme / doğru seçenek = 1 puan; metin için normalize (TR locale, trim, lower).
- İleride: kısmi puan, soru ağırlığı.

---

## 7. Teknik mimari (güncel)

### 7.1 Depo (monorepo önerisi — tek repo)

```
kimkimi/
  apps/
    mobile/          # Flutter
    web/             # Next.js — kamu sitesi (+ ileride /oyna)
    admin/           # Next.js — yönetim paneli
    api/             # NestJS
  packages/
    shared/          # (opsiyonel) DTO / Zod
    api-client/      # (opsiyonel) OpenAPI'den üretilen istemci — web + admin paylaşımı
    ui/              # (opsiyonel) paylaşılan React bileşenleri — web ile admin
  turbo.json         # (opsiyonel) Turborepo — `web` + `admin` paralel build
  docker-compose.yml
  docker-compose.override.yml
```

**Not:** `web` ve `admin` ayrı Next uygulamalarıdır: farklı **deployment**, farklı **CORS origin**, admin için sıkı güvenlik; kamu sitesi için CDN/edge uyumlu statik önyükleme.

### 7.2 Flutter (mobil)

- **REST + WebSocket:** mevcut plan (oda, profil, oyun, sonuç).
- **Derin bağlantı:** Universal Links / App Links ile `https://webdomain/katil?kod=` açılırsa uygulama yüklüyse uygulamaya düşer; değilse web “indir / devam” sayfası.

### 7.3 NestJS API

| Modül | Sorumluluk |
|--------|------------|
| **Auth** | Admin: bcrypt + JWT + rol. İsteğe bağlı: web oyuncu için mevcut `player_token` akışı (mobil ile aynı) |
| **Categories / Questions** | CRUD; yayınlanan içerik |
| **Rooms / Answers / Scoring** | Önceki plan ile aynı |
| **Realtime (Gateway)** | Socket.io; web oyuncu da aynı olay sözleşmesine uyur |

**ORM:** Prisma veya TypeORM; migration zorunlu.

### 7.4 PostgreSQL — kavramsal tablolar

Önceki bölümle aynı (`admin_users`, `categories`, `questions`, `rooms`, `room_players`, `answers`, `game_results`). Web yalnızca ek tablo gerektirmez; oyun tarayıcıda açılırsa istemci türü loglanabilir (`client_type`: mobile_web / flutter — opsiyonel analitik kolonu).

### 7.5 Next.js kamu sitesi (`apps/web`)

| Alan | Açıklama |
|------|-----------|
| **Çerçeve** | App Router, TypeScript, mümkünse **Sunucu Bileşenleri** ile landing ve hukuki metinler |
| **SEO** | `generateMetadata`, yapılandırılmış veri (isteğe bağlı `JSON-LD`), `sitemap`, `robots` |
| **İçerik** | Statik sayfalar + ileride MDX/headless CMS |
| **Oyun (faz 2)** | İstemci bileşenlerinde `socket.io-client`; ortam değişkenleri: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` |
| **Dağıtım** | Vercel, Cloudflare Pages veya Docker + reverse proxy; **admin ile ayrı domain veya alt path** önerisi: örn. `kimkimi.app` (web), `admin.kimkimi.app` (admin) |

### 7.6 Next.js admin paneli (`apps/admin`)

- Önceki plan: korumalı dashboard, Nest CRUD, httpOnly cookie, middleware.

### 7.7 Docker ve yerel geliştirme

- Postgres (+ healthcheck) değişmez.
- **Web ve admin:** `pnpm dev` / `npm run dev` ile `localhost:3000` ve `localhost:3001` gibi **farklı portlar**; Nest CORS’ta her iki origin listelenir.

---

## 8. Senkronizasyon kuralları (REST + WebSocket)

Önceki maddeler geçerli. **Web oyuncu** eklendiğinde: aynı **transaction** ve **emit** sırası; Socket.io tarafında istemci türü ayrımı gerekmez, yalnızca `room` üyeliği ve token doğrulaması yeterli.

---

## 9. Güvenlik ve yasal

- Admin ve **kamu web** için ayrı origin; **CORS** ve çerez **SameSite** politikaları buna göre.
- Kamu sitede **KVKK aydınlatma** ve **çerez bilgilendirmesi** (analytics kullanılırsa).
- Rate limit: join ve kod denemeleri (mobil + web paylaşımlı backend kuralı).

---

## 10. Kalite, test, operasyon

| Katman | Araç / pratik |
|--------|----------------|
| API | Jest, Supertest |
| DB | Migration CI |
| Flutter | `flutter test`, mock API/WS |
| **Web + admin** | ESLint, **Playwright** (kritik akışlar), **Lighthouse** (web MVP — SEO ve erişilebilirlik) |
| Docker | Compose smoke |
| CI | Turborepo kullanılıyorsa `turbo run build lint test` ile görev grafiği |

---

## 11. Yol haritası (fazlar) — güncel

| Faz | Süre (kabaca) | Çıktı |
|-----|----------------|--------|
| **F0 — Tasarım** | 1–2 hafta | ER, OpenAPI, WS olayları, **web bilgi mimarisi** (sayfa ağacı), Flutter + web wireframe |
| **F1 — Altyapı** | ~1 hafta | Docker Postgres, Nest iskelet, monorepo (pnpm workspace + isteğe bağlı Turbo) |
| **F2 — İçerik + istemciler iskelet** | 2–3 hafta | Kategori/soru API + **admin** CRUD + **`apps/web` MVP** (landing, hukuki, mağaza linkleri, SEO) |
| **F3 — Oyun API + WS** | 2–4 hafta | Oda, profil, oyun transaction, Gateway; **Flutter** entegrasyonu |
| **F4 — Flutter MVP** | 2–4 hafta | Tam mobil akış |
| **F5 — Web oyuncu (isteğe bağlı)** | 2–3 hafta | `apps/web` içinde `/oyna` veya ayrı route grubu; socket.io-client; temel responsive UI |
| **F6 — Polish + yayın** | 2+ hafta | Mağaza varlıkları, **web + admin + API** prod dağıtımı, yedekleme |

*F2’de web kamu sitesi admin ile paralel başlayabilir; F5 bağımsız iterasyon.*

---

## 12. Riskler ve azaltma

| Risk | Azaltma |
|------|---------|
| WS ile DB tutarsızlığı | Önce commit, sonra emit |
| Üç istemci (Flutter, web, admin) sözleşme kayması | **OpenAPI tek kaynak**; `api-client` paketi veya kod üretimi |
| SEO içeriği ile oyun bundle’ının aynı Next’te çakışması | Route grupları: `(marketing)` sunucu öncelikli, `(play)` istemci ağırlıklı; code-splitting |
| Kamu sitesi saldırı yüzeyi | Admin’i ayrı subdomain’de tutma; güvenlik başlıkları (CSP ileride) |

---

## 13. Kaynaklar (araştırma)

- [Vercel — Turborepo + Next.js monorepo şablonu](https://vercel.com/templates/next.js/monorepo-turborepo)
- [Çoklu Next.js uygulaması ve Turborepo](https://www.zartek.in/how-to-manage-multiple-next-js-apps-with-turborepo/)
- [Aynı Next.js kod tabanında pazarlama + uygulama](https://prateeksha.com/blog/nextjs-marketing-site-web-app-same-codebase) (üçüncü taraf)
- [Flutter Web ve SEO / pazarlama sınırları tartışması](https://dev.to/robertbrunhage/flutter-web-opinions-why-i-choose-next-3klk) (üçüncü taraf görüş; teknik karar bağlamında değerlendirin)
- [Docker Docs — PostgreSQL ve kalıcılık](https://docs.docker.com/guides/postgresql/immediate-setup-and-data-persistence/)
- [NestJS WebSockets / Gateway](https://docs.nestjs.com/websockets/gateways)
- [Next.js + NestJS güvenlik özeti](https://www.reversebits.tech/blog/nextjs-nestjs-security)

---

## 14. Sonraki somut adımlar

1. Monorepo kökü: `pnpm-workspace.yaml` (veya npm workspaces), `apps/web`, `apps/admin`, `apps/api` klasör stratejisi; isteğe bağlı `npx create-turbo@latest` ile hizalama.
2. `apps/web`: `create-next-app`, ana sayfa + `privacy` + `terms` + `nasil-oynanir`, `app/sitemap.ts` / `robots.ts`.
3. `apps/api`: CORS’a `http://localhost:3000` (web) ve `http://localhost:3001` (admin) ekle.
4. QR ve paylaşım stratejisi: üretimde `https://{webDomain}/katil?kod=` taslağı; mobil deep link dokümantasyonu.
5. OpenAPI şeması çıktığında `packages/api-client` veya Orval ile admin + (faz 5) web oyuncu istemcisini üret.

---

*Belge 3.0: Kamu **web** projesi (Next.js `apps/web`), SEO ve isteğe bağlı tarayıcıdan oyun fazı eklendi; monorepo ve Turborepo pratikleri araştırma ile uyumlu hale getirildi.*
