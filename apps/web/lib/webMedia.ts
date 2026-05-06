/**
 * `public/media/` altındaki GIF yolları (dosya adları büyük/küçük harf dahil birebir).
 * Eksik dosyada `InlineGif` sessizce gizlenir; `fallbackSrc` ile bir yedek ad denenir.
 */
export const WEB_MEDIA = {
  sayMyName: '/media/sayMyName.gif',
  sayMyNameFallback: '/media/SayMyName.gif',

  whoAreU: '/media/whoAreU.gif',
  whoAreUFallback: '/media/whoareu.gif',

  /** Profil: kendi hakkında cevaplar */
  doYouKnow: '/media/doYouKnow.gif',
  doYouKnowFallback: '/media/DoYouKnow.gif',

  /** Bekleme / hazırlık */
  waitAMinute: '/media/waitAMinute.gif',
  waitAMinuteFallback: '/media/WaitAMinute.gif',

  /** Kimlik / tahmin turu */
  whoAmI: '/media/whoAmI.gif',
  whoAmIFallback: '/media/WhoAmI.gif',

  /** Profil giriş bandı */
  weSee: '/media/weSee.gif',
  weSeeFallback: '/media/WeSee.gif',
} as const;
