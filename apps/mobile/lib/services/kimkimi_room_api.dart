import 'dart:convert';

import '../api_config.dart';
import '../kimkimi_http.dart';
import '../models/public_question.dart';

class KimKimiRoomApi {
  KimKimiRoomApi({required this.secretId, required this.playerToken});

  final String secretId;
  final String playerToken;

  Uri _u(String path) => Uri.parse('$kApiBase$path');

  Map<String, String> _authHeaders() => {
        'Authorization': 'Bearer $playerToken',
        'Content-Type': 'application/json',
      };

  static bool _ok2xx(int code) => code >= 200 && code < 300;

  Future<Map<String, dynamic>> getState() async {
    final r = await kimkimiGet(_u('/rooms/$secretId/state'), headers: _authHeaders());
    if (r.statusCode != 200) {
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
    if (!_ok2xx(r.statusCode)) {
      throw StateException('Profil cevapları gönderilemedi (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
  }

  Future<void> submitGameAnswer(String questionId, Object value) async {
    final r = await kimkimiPost(
      _u('/rooms/$secretId/game-answers'),
      headers: _authHeaders(),
      body: jsonEncode({'questionId': questionId, 'value': value}),
    );
    if (!_ok2xx(r.statusCode)) {
      throw StateException('Oyun cevabı gönderilemedi (${r.statusCode})', r.body, statusCode: r.statusCode);
    }
  }

  Future<dynamic> getResults() async {
    final r = await kimkimiGet(_u('/rooms/$secretId/results'), headers: _authHeaders());
    if (r.statusCode != 200) {
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
    if (r.statusCode != 200) {
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
