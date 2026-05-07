# KimKimi monorepo

Sıra: **API (NestJS)** → **Admin (Next.js)** → **Web (Next.js)** → **Mobil (Flutter)**.

## Önkoşullar..

- Node.js 20+
- Docker Desktop (PostgreSQL için)
- Flutter SDK (mobil faz için)

## 1. Veritabanı

```bash
docker compose up -d
```

Port: **5433** (host) → 5432 (konteyner).

## 2. API (`apps/api`)

```bash
cd apps/api
cp ../../.env.example .env
# Gerekirse .env içindeki DATABASE_URL'i doğrula
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

- REST: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`
- Admin girişi (seed): `admin@kimkimi.local` / `Admin123!`

### Testler

```bash
cd apps/api
npm test
npm run test:e2e
```

Veritabanı ayakta ve tam akış e2e için:

```bash
npm run test:e2e:db
```

## 3. Admin (`apps/admin`)

```bash
cd apps/admin
cp .env.local.example .env.local
npm run dev
```

Varsayılan port **3001**. Giriş: `admin@kimkimi.local` / `Admin123!` (API seed).

Playwright (isteğe bağlı, dev sunucu açıkken):

```bash
cd apps/admin
npm run test:pw
```

## 4. Kamu web (`apps/web`)

**Önemli:** Komutu **mutlaka** `apps/web` içinde veya aşağıdaki gibi **repo kökünden** çalıştır. Kökte tek başına `npm run dev` yoktur (script tanımlı değil).

```bash
# Seçenek A — repo kökü (kimkimi/)
npm run web:install
npm run web

# Seçenek B — klasör içi (PowerShell’de zincir için ; kullan)
cd apps/web
npm install
cp .env.local.example .env.local
npm run dev
```

Port **3000 dolu** ise: `cd apps/web` → `npm run dev:3002` → tarayıcıda `http://localhost:3002`.

Varsayılan port **3000**. `NEXT_PUBLIC_SITE_URL` üretimde gerçek domain olmalıdır.

### Uzaktan oynatma (arkadaşla, mevcut stack)

İki taraf da aynı API’ye ve aynı veritabanına bağlanmalı; tarayıcı CORS’u ve web’in bildiği API adresi (`NEXT_PUBLIC_API_URL`) buna göre ayarlanmalıdır.

**A) İki tünel (ör. [ngrok](https://ngrok.com/) — ücretsiz planda iki ayrı terminal)**

1. API: `ngrok http 4000` → çıkan `https://…` adresini not al.
2. Web: `ngrok http 3000` → çıkan `https://…` adresini not al.
3. `apps/api/.env`: `CORS_ORIGINS=*` (yalnızca güvenilir deneme için) **veya** web tünelinin tam origin’i, örn. `https://abc.ngrok-free.app`.
4. `apps/web/.env.local`: `NEXT_PUBLIC_API_URL=<API tünel URL’si>`, `NEXT_PUBLIC_SITE_URL=<Web tünel URL’si>`. API’yi ve web’i yeniden başlat.
5. Oda linkini arkadaşına **web tünel** üzerinden ver: `https://…/oyna` veya `https://…/oda/<secretId>`.

**B) Aynı Wi‑Fi (LAN)**

1. Web: `cd apps/web && npm run dev:lan` (makine IP’si üzerinden `http://<senin-ip>:3000`).
2. `apps/web/.env.local`: `NEXT_PUBLIC_API_URL=http://<senin-ip>:4000` (API’yi de `0.0.0.0` üzerinde dinletmen gerekir; Nest varsayılanı tüm arayüzlerdir).
3. `apps/api/.env` içinde `CORS_ORIGINS` listesine `http://<senin-ip>:3000` ekle.

**Mobil:** Emülatör yerine gerçek cihaz / uzak API için `flutter run --dart-define=API_BASE=https://<api-tünel veya ip>`.

## 5. Mobil (`apps/mobile`)

Windows’ta proje yolu **Türkçe karakter** içeriyorsa (`Masaüstü` vb.) Android `aapt` hatası alabilirsiniz. Çözüm: [apps/mobile/WINDOWS_UTF8_YOL.md](apps/mobile/WINDOWS_UTF8_YOL.md) (`subst` ile ASCII sürücü).

```bash
cd apps/mobile
flutter pub get
flutter analyze
flutter test
```

Android emülatörden host makinedeki API’ye:  
`flutter run --dart-define=API_BASE=http://10.0.2.2:4000`

İki cihaz senaryosu: [apps/mobile/IKI_CIHaz_CHECKLIST.md](apps/mobile/IKI_CIHaz_CHECKLIST.md)

**CORS:** `apps/api/.env` içindeki `CORS_ORIGINS` değerinde `http://localhost:3000` (web) ve `http://localhost:3001` (admin) bulunmalıdır. Uzaktan tünel için `*` veya web’in public origin’i — bkz. yukarıdaki “Uzaktan oynatma”.

## WebSocket

Olay sözleşmesi: [apps/api/docs/WS_EVENTS.md](apps/api/docs/WS_EVENTS.md).

## API ortam değişkenleri

Kök [.env.example](.env.example) ve `apps/api/.env` — `CORS_ORIGINS` içine web ve admin origin’lerini ekleyin.
