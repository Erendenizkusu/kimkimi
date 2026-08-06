# Sürüm imzası (Play Store)

Play Store, debug anahtarıyla imzalanmış paketi **kabul etmez**. Yükleme öncesi bir kez
kendi keystore'unu üretmen gerekiyor.

> ⚠️ Bu anahtarı kaybedersen uygulamaya bir daha güncelleme yayınlayamazsın —
> yeni bir uygulama olarak baştan yayınlamak zorunda kalırsın. Yedekle.
> (Play App Signing kullanıyorsan Google yükleme anahtarını sıfırlayabilir, ama
> yine de kaybetmemek en iyisi.)

## 1) Keystore üret

`keytool` JDK ile gelir; Android Studio kuruluysa zaten var.

```powershell
keytool -genkey -v `
  -keystore $env:USERPROFILE\kimkimi-upload.jks `
  -storetype JKS `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -alias kimkimi
```

Sorduğu bilgileri doldur, parolayı **not al**. Dosyayı repo dizinine koyma.

## 2) `android/key.properties` oluştur

`apps/mobile/android/key.properties` (bu dosya `.gitignore`'da, commit'lenmez):

```properties
storePassword=BURAYA_STORE_PAROLASI
keyPassword=BURAYA_KEY_PAROLASI
keyAlias=kimkimi
storeFile=C:/Users/User/kimkimi-upload.jks
```

`storeFile` yolunda **ters bölü değil düz bölü** kullan (`C:/...`).

## 3) Derle

```powershell
cd apps/mobile
flutter build appbundle --release
```

Çıktı: `build/app/outputs/bundle/release/app-release.aab`

## Doğrulama

`key.properties` yoksa `build.gradle.kts` sessizce debug anahtarına düşer — yerelde
`--release` denemek için pratik, ama o paket Play Store'a yüklenemez. Gerçekten sürüm
anahtarıyla imzalandığını doğrulamak için:

```powershell
jarsigner -verify -verbose -certs build/app/outputs/bundle/release/app-release.aab
```

Çıktıda `CN=` alanının keytool'a girdiğin bilgilerle eşleştiğini gör. `Android Debug`
yazıyorsa `key.properties` okunmamış demektir.
