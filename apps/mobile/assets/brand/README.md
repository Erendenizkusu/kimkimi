# KimKimi marka varlıkları

## Fikir

İki kesişen daire = **iki oyuncu**. Kesişimlerinde oluşan mercek (vesica) =
**ortak alan**, yani birlikte incelenen şey; içindeki soru işareti de oyunun
kendisi: *birbirimizi ne kadar tanıyoruz?*

Mercek biçimi aynı zamanda bir büyüteç camına ve bir göze benzediği için, klasik
büyüteç ikonuna düşmeden o çağrışımı taşır — uygulama çekmecesinde her uygulamada
bulunan arama simgesine benzemez.

Renkler mevcut markadan: mor → menekşe → magenta (`#5b21b6` → `#9333ea` → `#db2777`).

## Dosyalar

| Dosya | Ne için |
|---|---|
| `kimkimi_mark.svg` | Uygulama içi işaret (app bar). Zemini yok, gradyan dolu daireler + beyaz `?` |
| `app_icon.svg` | Launcher/mağaza ikonu — tam kanama gradyan zemin + beyaz halkalar |
| `app_icon_foreground.svg` | Adaptive ikon ön katmanı (saydam zemin) |
| `../icon/*.png` | Yukarıdakilerden üretilen PNG'ler — `flutter_launcher_icons` girdisi |
| `../icon/play_store_512.png` | Play Console'a **elle** yüklenecek 512×512 mağaza ikonu |

SVG'ler tasarımın kaynağıdır; PNG'ler türetilmiştir.

## Web/admin kopyaları — burası değişirse onlar da değişmeli

Bu klasör tek kaynak; web tarafındaki dosyalar buradan türetildi ve **otomatik
senkron değil**:

| Dosya | Kaynağı |
|---|---|
| `apps/web/public/brand/kimkimi-mark.svg` | `kimkimi_mark.svg` — aynı çizim, viewBox içeriğe kırpılmış |
| `apps/web/app/icon.svg` | `app_icon.svg` — birebir |
| `apps/web/app/favicon.ico` · `apps/admin/app/favicon.ico` | `../icon/play_store_512.png` → 16/32/48 |
| `apps/web/app/apple-icon.png` | `../icon/play_store_512.png` → 180×180 |

`.ico` ve `apple-icon.png` üretimi (Windows, ek bağımlılık yok): `System.Drawing`
ile 512'lik PNG'yi ölçekleyip ICO başlığını elle yaz — ayrıntı için bu commit'e bak.

## Tasarım kısıtları — değiştirirken dikkat

- **Yazı koyma.** Launcher'da ikon 48dp; o boyutta yazı okunaksız lekeye dönüşür.
- **`?` yazı tipi değil, çizilmiş yoldur.** `<text>` kullanılırsa glif platformdan
  platforma değişir ve flutter_svg yazı tipi çözmek zorunda kalır.
- **`feDropShadow` kullanma.** flutter_svg desteklemiyor; testte
  `unhandled element <filter/>` uyarısı bu yüzden çıkıyordu.
- **Adaptive güvenli alan.** `ic_launcher.xml` ön katmana %16 iç boşluk uyguluyor,
  ardından launcher maskesi 108dp tuvalin ortadaki 72dp'sini gösteriyor. Ön katman
  bu iki daralmayı hesaba katarak çizildi (`foreground(232)`); XML'i elle
  düzenlemek yerine kaynağı ayarla, yoksa araç yeniden çalıştırılınca bozulur.

## Yeniden üretim

PNG'ler `@resvg/resvg-js` ile SVG'lerden üretildi. Değişiklik sonrası:

```bash
cd apps/mobile
dart run flutter_launcher_icons
```

PNG'leri de yeniden üretmek gerekiyorsa SVG'leri 1024×1024 olarak dışa aktar
(`icon.png`, `icon_foreground.png`, `icon_background.png`) ve 512×512
(`play_store_512.png`), sonra yukarıdaki komutu çalıştır.
