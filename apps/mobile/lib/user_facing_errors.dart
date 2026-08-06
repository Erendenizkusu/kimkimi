import 'dart:async';
import 'dart:convert';
import 'dart:io';

/// Tarayıcıdaki `describeClientFetchError` ile aynı mantık (Dart ağ hataları).
String describeClientNetworkError(Object e) {
  if (e is TimeoutException) {
    return 'İstek zaman aşımına uğradı (18 sn). API yanıt vermiyor olabilir; sunucuyu ve bağlantını kontrol et.';
  }
  final msg = e.toString().toLowerCase();
  if (e is SocketException ||
      msg.contains('failed host lookup') ||
      msg.contains('network is unreachable') ||
      msg.contains('connection refused') ||
      msg.contains('connection reset')) {
    return 'Sunucuya ulaşılamıyor. İnternet bağlantını kontrol edip tekrar dene.';
  }
  return e.toString();
}

/// Web `userFacingApiMessage` ile aynı kurallar.
String userFacingApiMessage(int status, String body) {
  final raw = body.trim();
  var apiMessage = '';
  try {
    final j = jsonDecode(raw) as Map<String, dynamic>?;
    final m = j?['message'];
    final err = j?['error'];
    if (m is String) {
      apiMessage = m;
    } else if (err is String) {
      apiMessage = err;
    }
  } catch (_) {
    apiMessage = raw;
  }

  final m = apiMessage.toLowerCase();

  if (status == 404) {
    if (m.contains('category') || m.contains('kategori')) {
      return 'Bu kategori bulunamadı veya şu an kapalı. Başka bir kategori seç.';
    }
    if (m.contains('room') || m.contains('oda')) {
      return 'Bu kodla eşleşen bir oda bulunamadı. Kodu kontrol edip yeniden dene.';
    }
    return 'Aradığın kayıt bulunamadı. Bilgileri kontrol edip yeniden dene.';
  }
  if (status == 403 && (m.contains('expired') || m.contains('forbidden'))) {
    return 'Bu oda artık kullanılamıyor veya süresi dolmuş.';
  }
  if (status == 409 || m.contains('conflict')) {
    return 'Bu işlem şu an yapılamıyor. Biraz sonra tekrar dene.';
  }
  if (status == 400 || m.contains('bad request')) {
    return 'Girdiğin bilgilerle odaya katılamıyoruz. Kontrol edip yeniden dene.';
  }
  if (status >= 500) {
    return 'Sunucuya ulaşılamadı. Bir süre sonra tekrar dene.';
  }

  if (apiMessage.isNotEmpty && apiMessage.length < 160 && !apiMessage.trim().startsWith('{')) {
    return apiMessage;
  }

  return 'İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.';
}
