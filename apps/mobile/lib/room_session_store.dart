import 'package:shared_preferences/shared_preferences.dart';

/// Web `localStorage` oda oturumuna benzer: uygulama kapanıp açılınca kaldığın odaya dönmek için.
class RoomSessionStore {
  static const _kSecret = 'kk_room_secret_id';
  static const _kToken = 'kk_room_player_token';
  static const _kCode = 'kk_room_short_code';
  static const _kHost = 'kk_room_is_host';

  static Future<void> save({
    required String secretId,
    required String playerToken,
    required String shortCode,
    required bool isHost,
  }) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(_kSecret, secretId);
    await p.setString(_kToken, playerToken);
    await p.setString(_kCode, shortCode);
    await p.setBool(_kHost, isHost);
  }

  static Future<({String secretId, String playerToken, String shortCode, bool isHost})?> load() async {
    final p = await SharedPreferences.getInstance();
    final secret = p.getString(_kSecret);
    final token = p.getString(_kToken);
    final code = p.getString(_kCode);
    if (secret == null || token == null || code == null) return null;
    final host = p.getBool(_kHost) ?? true;
    return (secretId: secret, playerToken: token, shortCode: code, isHost: host);
  }

  static Future<void> clear() async {
    final p = await SharedPreferences.getInstance();
    await p.remove(_kSecret);
    await p.remove(_kToken);
    await p.remove(_kCode);
    await p.remove(_kHost);
  }
}
