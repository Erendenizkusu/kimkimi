# Windows + Türkçe klasör yolu (Masaüstü) ve Android derlemesi

`aapt` / `ziparchive` bazen **yol dizesinde UTF-8 karakter** (ör. `ü`) olduğunda `Illegal byte sequence` veya manifest okuma hatası verir. `android.overridePathCheck=true` Gradle’ı açar ama **SDK araçları** yine de Unicode yolu sevmeyebilir.

## Önerilen çözüm: `subst` ile ASCII sürücü

1. PowerShell’de proje kökünden (`kimkimi`):

   ```powershell
   cd apps\mobile\scripts
   .\subst_calistir.ps1
   ```

2. Çıktıdaki gibi **`K:`** (veya scriptteki harf) altında çalışın:

   ```powershell
   K:
   cd K:\apps\mobile
   flutter pub get
   flutter run
   ```

3. İşiniz bitince bağlantıyı kaldırın:

   ```powershell
   subst K: /D
   ```

Bu şekilde tüm dosya yolları `K:\...` ile **ASCII** kalır; `aapt` APK’yı sorunsuz okuyabilir.

## Kalıcı çözüm

Projeyi `C:\dev\kimkimi` gibi **yalnızca ASCII** içeren bir dizine taşımak.
