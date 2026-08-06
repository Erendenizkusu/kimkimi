import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// API artık web uygulamasının içinde (`apps/web/app/api/*`) — yani taban adres
/// Next.js sunucusunun kökü + `/api`. Geliştirmede Next varsayılan olarak 3000'de.
///
/// Üretim derlemesi:
///   flutter build appbundle --dart-define=API_BASE=https://kimkimi.vercel.app/api
/// Gerçek cihazda yerel sunucuya bağlanmak için:
///   `flutter run --dart-define=API_BASE=http://<PC_LAN_IP>:3000/api`
///
/// `API_BASE` verilmezse:
/// - Android: emülatörde bilgisayardaki sunucu için `10.0.2.2` (localhost değil).
/// - iOS simülatör / masaüstü: `127.0.0.1` yeterli.
String get kApiBase {
  const fromEnv = String.fromEnvironment('API_BASE', defaultValue: '');
  if (fromEnv.isNotEmpty) return fromEnv.replaceAll(RegExp(r'/$'), '');
  if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://127.0.0.1:3000/api';
}

/// Oda durumunun sunucudan çekilme sıklığı (eski socket.io yayınının yerine).
const Duration kRoomPollInterval = Duration(seconds: 2);

/// Web `public/media` GIF’leri için taban URL (örn. `http://10.0.2.2:3000`). Boşsa sonuç ekranında GIF kullanılmaz.
String get kWebPublicBase {
  const fromEnv = String.fromEnvironment('WEB_PUBLIC_BASE', defaultValue: '');
  if (fromEnv.isEmpty) return '';
  return fromEnv.replaceAll(RegExp(r'/$'), '');
}
