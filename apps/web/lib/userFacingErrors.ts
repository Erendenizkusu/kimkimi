/**
 * API gövdesi (genelde Nest JSON) ve HTTP kodundan oyuncuya gösterilecek Türkçe metin üretir.
 */
export function userFacingApiMessage(status: number, body: string): string {
  const raw = body.trim();
  let apiMessage = '';
  try {
    const j = JSON.parse(raw) as { message?: unknown; error?: unknown };
    if (typeof j.message === 'string') apiMessage = j.message;
    else if (typeof j.error === 'string') apiMessage = j.error;
  } catch {
    apiMessage = raw;
  }

  const m = apiMessage.toLowerCase();

  if (status === 404) {
    if (m.includes('category') || m.includes('kategori')) {
      return 'Bu kategori bulunamadı veya şu an kapalı. Başka bir kategori seç.';
    }
    if (m.includes('room') || m.includes('oda')) {
      return 'Bu kodla eşleşen bir oda bulunamadı. Kodu kontrol edip yeniden dene.';
    }
    return 'Aradığın kayıt bulunamadı. Bilgileri kontrol edip yeniden dene.';
  }
  if (status === 403 && (m.includes('expired') || m.includes('forbidden'))) {
    return 'Bu oda artık kullanılamıyor veya süresi dolmuş.';
  }
  if (status === 409 || m.includes('conflict')) {
    return 'Bu işlem şu an yapılamıyor. Biraz sonra tekrar dene.';
  }
  if (status === 400 || m.includes('bad request')) {
    return 'Girdiğin bilgilerle odaya katılamıyoruz. Kontrol edip yeniden dene.';
  }
  if (status >= 500) {
    return 'Sunucuya ulaşılamadı. Bir süre sonra tekrar dene.';
  }

  if (apiMessage && apiMessage.length < 160 && !apiMessage.trim().startsWith('{')) {
    return apiMessage;
  }

  return 'İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.';
}
