# UTF-8 masaüstü yolu yüzünden aapt/zip "Illegal byte sequence" hatasını aşmak için:
# Proje kökünü ASCII bir sürücü harfine bağlayıp ORADAN Flutter çalıştırın.
#
# Kullanım (PowerShell, yönetici GEREKMEZ):
#   .\scripts\subst_calistir.ps1
# Sonra açılan yeni pencerede: cd apps\mobile ; flutter run
#
# Kapatmak için: subst K: /D

$ErrorActionPreference = "Stop"
$harf = "K"
# scripts -> mobile -> apps -> repo kökü (kimkimi)
$kok = Resolve-Path (Join-Path $PSScriptRoot "..\..\..")

$mevcut = (subst) 2>$null | Select-String "^$harf`:\\"
if ($mevcut) {
    Write-Host "$harf`: zaten kullanımda. Kaldırmak için: subst $harf`:/D"
    exit 1
}

subst "${harf}:" $kok
Write-Host "Bağlandı: ${harf}:\ -> $kok"
Write-Host ""
Write-Host "Şimdi şunu çalıştırın:"
Write-Host "  ${harf}:\apps\mobile"
Write-Host "  flutter pub get"
Write-Host "  flutter run"
