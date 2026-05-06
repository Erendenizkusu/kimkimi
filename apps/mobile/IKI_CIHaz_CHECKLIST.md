# İki cihaz / emülatör manuel kontrol listesi

**Windows ve yol `Masaüstü` gibi UTF-8 içeriyorsa:** önce [WINDOWS_UTF8_YOL.md](WINDOWS_UTF8_YOL.md) — `subst` ile `K:\` altında `flutter run`.

1. API: `docker compose up -d`, `cd apps/api && npx prisma migrate deploy && npx prisma db seed && npm run start:dev`
2. **Android emülatör** için: `flutter run --dart-define=API_BASE=http://10.0.2.2:4000`
3. **İkinci cihaz** veya emülatör: aynı API’ye erişebildiğinden emin olun (fiziksel cihazda bilgisayarın LAN IP’si ile `API_BASE`).
4. Cihaz A: kategori seç → oda aç → kısa kodu not al.
5. Cihaz B: Katıl → kodu gir → profil sorularını her iki tarafta doldur → oyun turunda sırayla cevapla.
6. Oyun bitince sonuçların API’de döndüğünü doğrulayın (`GET /rooms/:secretId/results`).
