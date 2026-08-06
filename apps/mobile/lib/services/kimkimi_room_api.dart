import 'dart:convert';

import '../api_config.dart';
import '../kimkimi_http.dart';
import '../models/public_question.dart';

/// `POST /rooms` yanıtı.
typedef CreatedRoom = ({String secretId, String shortCode, String hostPlayerToken});

/// `POST /rooms/join` yanıtı.
typedef JoinedRoom = ({String secretId, String guestPlayerToken});

class KimKimiRoomApi {
  KimKimiRoomApi({required this.secretId, required this.playerToken});

  final String secretId;
  final String playerToken;

  Uri _u(String path) => Uri.parse('$kApiBase$path');

  static Uri _url(String path) => Uri.parse('$kApiBase$path');

  static const Map<String, String> _jsonHeaders = {'Content-Type': 'application/json'};

  /// Oynanabilir kategoriler (yayınlanmış profil + eşlemeli oyun sorusu olanlar).
  static Future<List<Map<String, dynamic>>> fetchCategories() async {
    final r = await kimkimiGet(_url('/public/categories'));
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Kategoriler alınamadı (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    final list = jsonDecode(r.body) as List<dynamic>;
    return list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
  }

  static Future<CreatedRoom> createRoom({
    required String categoryId,
    required String hostDisplayName,
  }) async {
    final r = await kimkimiPost(
      _url('/rooms'),
      headers: _jsonHeaders,
      body: jsonEncode({'categoryId': categoryId, 'hostDisplayName': hostDisplayName}),
    );
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Oda açılamadı (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    final b = jsonDecode(r.body) as Map<String, dynamic>;
    return (
      secretId: b['secretId'] as String,
      shortCode: b['shortCode'] as String,
      hostPlayerToken: b['hostPlayerToken'] as String,
    );
  }

  static Future<JoinedRoom> joinRoom({
    required String shortCode,
    required String guestDisplayName,
  }) async {
    final r = await kimkimiPost(
      _url('/rooms/join'),
      headers: _jsonHeaders,
      body: jsonEncode({'shortCode': shortCode, 'guestDisplayName': guestDisplayName}),
    );
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Odaya katılınamadı (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    final b = jsonDecode(r.body) as Map<String, dynamic>;
    return (
      secretId: b['secretId'] as String,
      guestPlayerToken: b['guestPlayerToken'] as String,
    );
  }

  Map<String, String> _authHeaders() => {
        'Authorization': 'Bearer $playerToken',
        'Content-Type': 'application/json',
      };

  Future<Map<String, dynamic>> getState() async {
    final r = await kimkimiGet(_u('/rooms/$secretId/state'), headers: _authHeaders());
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Oda durumu alınamadı (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  Future<void> submitProfileAnswers(List<Map<String, dynamic>> answers) async {
    final r = await kimkimiPost(
      _u('/rooms/$secretId/profile-answers'),
      headers: _authHeaders(),
      body: jsonEncode({'answers': answers}),
    );
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Profil cevapları gönderilemedi (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
  }

  Future<void> submitGameAnswer(String questionId, Object value) async {
    final r = await kimkimiPost(
      _u('/rooms/$secretId/game-answers'),
      headers: _authHeaders(),
      body: jsonEncode({'questionId': questionId, 'value': value}),
    );
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Oyun cevabı gönderilemedi (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
  }

  Future<dynamic> getResults() async {
    final r = await kimkimiGet(_u('/rooms/$secretId/results'), headers: _authHeaders());
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Sonuçlar alınamadı (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    return jsonDecode(r.body);
  }

  static Future<List<PublicQuestion>> fetchPublicQuestions(
    String categorySlug,
    String phase, {
    String? secretId,
  }) async {
    final qp = <String, String>{'phase': phase};
    if (secretId != null && secretId.isNotEmpty) qp['secretId'] = secretId;
    final uri = Uri.parse('$kApiBase/public/categories/$categorySlug/questions').replace(
      queryParameters: qp,
    );
    final r = await kimkimiGet(uri);
    if (!isOk2xx(r.statusCode)) {
      throw StateException('Sorular yüklenemedi (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
    final list = jsonDecode(r.body) as List<dynamic>;
    return list.map((e) => PublicQuestion.fromJson(Map<String, dynamic>.from(e as Map))).toList();
  }
}

class StateException implements Exception {
  StateException(this.message, this.body, {this.statusCode});
  final String message;
  final String body;
  final int? statusCode;

  @override
  String toString() => '$message: $body';
}
