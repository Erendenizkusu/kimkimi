import 'dart:async';

import 'package:http/http.dart' as http;

/// Emülatör/cihazda API yanıt vermezse `http` paketi uzun süre takılabiliyor; üst sınır şart.
const Duration kimkimiHttpTimeout = Duration(seconds: 18);

Future<http.Response> kimkimiGet(Uri uri, {Map<String, String>? headers}) {
  return http.get(uri, headers: headers).timeout(
        kimkimiHttpTimeout,
        onTimeout: () => throw TimeoutException(
          'Sunucuya ${kimkimiHttpTimeout.inSeconds} sn içinde ulaşılamadı: $uri',
        ),
      );
}

Future<http.Response> kimkimiPost(
  Uri uri, {
  Map<String, String>? headers,
  Object? body,
}) {
  return http.post(uri, headers: headers, body: body).timeout(
        kimkimiHttpTimeout,
        onTimeout: () => throw TimeoutException(
          'Sunucuya ${kimkimiHttpTimeout.inSeconds} sn içinde ulaşılamadı: $uri',
        ),
      );
}
