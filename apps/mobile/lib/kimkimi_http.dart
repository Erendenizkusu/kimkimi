import 'dart:async';
import 'dart:io';

import 'package:http/http.dart' as http;

/// Emülatör/cihazda API yanıt vermezse `http` paketi uzun süre takılabiliyor; üst sınır şart.
const Duration kimkimiHttpTimeout = Duration(seconds: 18);

/// Geçici ağ hatasında kaç kez daha denenir.
const int _kMaxRetries = 2;

/// Başarılı yanıt kontrolü. **Kesin durum kodu karşılaştırması yapma** — API
/// NestJS'teyken POST'lara 201, Next.js route handler'larına taşındıktan sonra
/// 200 dönüyor. `statusCode != 201` yazan yerler bu geçişte sessizce kırılmıştı.
bool isOk2xx(int code) => code >= 200 && code < 300;

/// Tüm istekler tek istemciden geçer.
///
/// `http.get` / `http.post` üst düzey fonksiyonları her çağrıda yeni bir istemci
/// açıp kapatıyor, yani her istekte baştan TLS el sıkışması oluyor. Oda ekranı
/// 2 saniyede bir durum çektiği için bu hem pil hem gecikme israfı; arka arkaya
/// istek atıldığında da `HandshakeException` ile düşebiliyor. Paylaşılan istemci
/// bağlantıyı canlı tutar.
final http.Client _client = http.Client();

/// Bağlantı kurulurken oluşan geçici hatalar — istek sunucuya ulaşmadığı için
/// yeniden denemek güvenli (aynı isteği iki kez işlemiş olmayız).
bool _isTransient(Object e) =>
    e is SocketException || e is HandshakeException || e is HttpException;

Future<http.Response> _send(
  Uri uri,
  Future<http.Response> Function() attempt,
) async {
  Object? lastError;
  for (var i = 0; i <= _kMaxRetries; i++) {
    try {
      return await attempt().timeout(
        kimkimiHttpTimeout,
        onTimeout: () => throw TimeoutException(
          'Sunucuya ${kimkimiHttpTimeout.inSeconds} sn içinde ulaşılamadı: $uri',
        ),
      );
    } catch (e) {
      if (!_isTransient(e) || i == _kMaxRetries) rethrow;
      lastError = e;
      await Future<void>.delayed(Duration(milliseconds: 200 * (i + 1)));
    }
  }
  throw lastError!;
}

Future<http.Response> kimkimiGet(Uri uri, {Map<String, String>? headers}) {
  return _send(uri, () => _client.get(uri, headers: headers));
}

Future<http.Response> kimkimiPost(
  Uri uri, {
  Map<String, String>? headers,
  Object? body,
}) {
  return _send(uri, () => _client.post(uri, headers: headers, body: body));
}
