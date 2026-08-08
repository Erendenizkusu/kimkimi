# KimKimi — Yayın Rehberi

> Topoloji: **web + backend tek Next.js uygulaması** (`apps/web`, Vercel serverless route'lar),
> **Neon** (Postgres), admin ayrı bir Vercel projesi. Ayrı API sunucusu **yok**.

```
Tarayıcı / Mobil
      │  GET /api/public/categories, POST /api/rooms, GET /api/rooms/:secretId/state …
      ▼
Vercel (apps/web — Next.js)          lib/server/*  (oda · skorlama · auth)
      │
      ▼
Neon (Postgres)  ← prisma/migrations + prisma/seed.ts
      ▲
      │  API_URL=https://<web-domain>/api
Vercel (apps/admin — Next.js)
```

## Neden bu yapı

Önceki kurulumda API ayrı bir Render **free** servisindeydi. Render free servisleri 15 dakika
hareketsizlikte uykuya geçiyor ve uyanması 30–60 saniye sürüyor. Vercel'deki site anında
açılıyordu ama ilk `/public/categories` isteğini beklediği için kullanıcı bir dakika boş
ekrana bakıyordu — kimse o kadar beklemez.

API artık Vercel'de site ile aynı uygulamada; serverless soğuk başlangıcı milisaniye
seviyesinde. Neon da scale-to-zero yapıyor ama ~1 saniyede uyanıyor (Supabase'in aksine
haftalık proje duraklatması yok — bu yüzden Neon'da kalındı).

## 1) Neon (veritabanı)

1. https://neon.tech → yeni proje (bölge: Frankfurt).
2. **Connection string**'i al — *pooled* olanı kullan (`-pooler` içeren).
3. Migration ve tohumlama, repo kökünden:
   ```bash
   cd apps/web
   DATABASE_URL="postgresql://…" npx prisma migrate deploy
   DATABASE_URL="postgresql://…" npx prisma db seed
   ```
   `db seed` idempotenttir: var olan soruları atlar, yalnızca eksikleri ekler ve
   Kural B yükseltmelerini uygular.

## 2) Vercel — web + API

Vercel → **Add New → Project → GitHub → bu repo**.

- **Root Directory:** `apps/web`
- **Framework Preset:** Next.js (otomatik)
- **Build Command:** varsayılan (`package.json` içindeki `prisma generate && next build`)

**Environment Variables** (Production + Preview):

| Anahtar | Değer | Not |
|---|---|---|
| `DATABASE_URL` | Neon pooled bağlantı dizini | zorunlu |
| `JWT_SECRET` | güçlü rastgele değer (32+ karakter) | zorunlu, gizli — admin girişini imzalar |
| `JWT_EXPIRES_IN` | `8h` | isteğe bağlı |
| `NEXT_PUBLIC_SITE_URL` | `https://kimkimi.app` | SEO / sitemap / OG. Boş bırakılırsa üretimde `lib/config.ts` → `SITE_URL` kullanılır |
| `NEXT_PUBLIC_API_URL` | **boş bırak** | doluysa API başka bir host'a gider; boşken aynı origin (`/api`) |

Deploy sonrası doğrulama:

```bash
curl https://<domain>/api/health          # {"status":"ok","db":true}
curl https://<domain>/api/public/categories
```

## 3) Alan adı — `kimkimi.app`

Alan adı Vercel üzerinden alındı, yani DNS'i zaten Vercel'de; ayrı bir kayıt şirketinde
nameserver değiştirmek gerekmiyor. Kalan iş onu **web projesine bağlamak**:

1. Vercel → **web projesi** → Settings → Domains → `kimkimi.app` ekle.
2. `www.kimkimi.app`'i de ekle ve köke **redirect** olarak işaretle (tek kanonik adres).
3. `NEXT_PUBLIC_SITE_URL` = `https://kimkimi.app` (Production).
4. Admin ayrı bir Vercel projesi — istersen aynı domain altında `admin.kimkimi.app`
   alt alanını o projeye bağla.

Kodda alan adının geçtiği yerler:

| Yer | Ne yapar |
|---|---|
| `apps/web/lib/config.ts` → `SITE_URL` | `metadataBase`, `sitemap.xml`, `robots.txt` ve canonical'ın kaynağı |
| `apps/mobile/lib/api_config.dart` → `kProductionApiBase` | Mağaza paketine **gömülür** — aşağıdaki uyarıya bak |

Bağlandıktan sonra doğrula:

```bash
curl -I https://kimkimi.app                       # 200
curl https://kimkimi.app/api/health               # {"status":"ok","db":true}
curl https://kimkimi.app/robots.txt               # sitemap: https://kimkimi.app/sitemap.xml
```

## 4) Vercel — admin paneli

Ayrı proje, **Root Directory:** `apps/admin`.

| Anahtar | Değer |
|---|---|
| `API_URL` | `https://kimkimi.app/api` — **sondaki `/api` şart** |

Admin, API'yi sunucu tarafından (`lib/server-api.ts`) çağırıyor; tarayıcı CORS'u devreye
girmiyor. Token `admin_access_token` çerezinde tutulup `Authorization: Bearer` olarak
iletiliyor.

## 5) Mobil

Varsayılan **üretimdir** — `api_config.dart` içindeki `kProductionApiBase`, artık
`https://kimkimi.app/api`. Mağaza paketi için ekstra bayrak gerekmez:

```bash
cd apps/mobile
flutter build appbundle --release
```

Bu kutuplaşma bilinçli: bayrak unutulursa uygulama canlı API'ye bağlanır. Tersi olsaydı
(varsayılan localhost) unutulan bir bayrak mağazaya hiç kimsede çalışmayan bir paket
gönderirdi.

Yerel sunucuya bağlanmak istersen ez:

```bash
flutter run --dart-define=API_BASE=http://10.0.2.2:3000/api      # Android emülatör
flutter run --dart-define=API_BASE=http://127.0.0.1:3000/api     # iOS sim / masaüstü
flutter run --dart-define=API_BASE=http://<PC_LAN_IP>:3000/api   # gerçek cihaz
```

> **Sıralama önemli.** Bu adres pakete gömülür ve yayınlandıktan sonra ancak yeni bir
> sürümle değişir. `kimkimi.app` web projesine bağlanıp `curl https://kimkimi.app/api/health`
> yanıt vermeden sürüm paketi üretme; aksi halde mağazadaki uygulama hiç açılmaz.

## 6) Render'ı kapat

Eski `kimkimi-api` servisi ve `render.yaml` artık kullanılmıyor. Render panelinden servisi
sil — aksi halde free instance saatlerini boşa harcamaya devam eder.

## Gerçek zamanlılık notu

Vercel serverless kalıcı WebSocket tutamaz. Oda durumu bu yüzden istemcilerden düzenli
aralıkla çekiliyor:

- Web: `RoomClient.tsx` → `ROOM_POLL_INTERVAL_MS = 2000`
- Mobil: `api_config.dart` → `kRoomPollInterval = 2 saniye`

Oyun iki kişilik ve sıra tabanlı; her turda iki oyuncu da cevaplayana kadar ilerlemiyor,
dolayısıyla 2 saniyelik gecikme oynanışta hissedilmiyor. Bir oda 10 soru sürüyor, yani
tipik bir oyun birkaç yüz hafif `state` isteği üretiyor — Vercel free kotası için önemsiz.

İleride anlık senkron istenirse Server-Sent Events (`/api/rooms/:secretId/stream`) bu
mimaride çalışır; poll'a göre değişiklik yalnızca istemci tarafındadır.
