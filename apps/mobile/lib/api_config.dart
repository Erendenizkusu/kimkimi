import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// `API_BASE` verilmezse:
/// - Android: emülatörde bilgisayardaki API için `10.0.2.2` (localhost değil).
/// - iOS simülatör / masaüstü: `127.0.0.1` yeterli.
/// Gerçek Android cihaz: `flutter run --dart-define=API_BASE=http://<PC_LAN_IP>:4000`
String get kApiBase {
  const fromEnv = String.fromEnvironment('API_BASE', defaultValue: '');
  if (fromEnv.isNotEmpty) return fromEnv;
  if (kIsWeb) return 'http://127.0.0.1:4000';
  if (defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:4000';
  }
  return 'http://127.0.0.1:4000';
}

/// Web `public/media` GIF’leri için taban URL (örn. `http://10.0.2.2:3000`). Boşsa sonuç ekranında GIF kullanılmaz.
String get kWebPublicBase {
  const fromEnv = String.fromEnvironment('WEB_PUBLIC_BASE', defaultValue: '');
  if (fromEnv.isEmpty) return '';
  return fromEnv.replaceAll(RegExp(r'/$'), '');
}
