/// Canlı API — web uygulamasının kökü + `/api`.
/// Özel alan adına geçilirse yalnızca burası değişir.
const String kProductionApiBase = 'https://kimkimi.vercel.app/api';

/// API taban adresi. **Varsayılan üretimdir**: bayrak unutulursa uygulama
/// çalışmaya devam eder, mağazaya kırık paket gitmez.
///
/// Yerel sunucuya bağlanmak istersen bayrakla ez:
///   Android emülatör : `--dart-define=API_BASE=http://10.0.2.2:3000/api`
///   iOS sim / masaüstü: `--dart-define=API_BASE=http://127.0.0.1:3000/api`
///   Gerçek cihaz      : `--dart-define=API_BASE=http://<PC_LAN_IP>:3000/api`
String get kApiBase {
  const fromEnv = String.fromEnvironment('API_BASE', defaultValue: '');
  if (fromEnv.isEmpty) return kProductionApiBase;
  return fromEnv.replaceAll(RegExp(r'/$'), '');
}

/// Oda durumunun sunucudan çekilme sıklığı (eski socket.io yayınının yerine).
const Duration kRoomPollInterval = Duration(seconds: 2);

/// Web `public/media` GIF’leri için taban URL. Boşsa sonuç ekranında GIF kullanılmaz.
String get kWebPublicBase {
  const fromEnv = String.fromEnvironment('WEB_PUBLIC_BASE', defaultValue: '');
  if (fromEnv.isEmpty) return '';
  return fromEnv.replaceAll(RegExp(r'/$'), '');
}
