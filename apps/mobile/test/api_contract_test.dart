@Tags(['live'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:kimkimi_mobile/api_config.dart';
import 'package:kimkimi_mobile/models/public_question.dart';
import 'package:kimkimi_mobile/questions_util.dart';
import 'package:kimkimi_mobile/services/kimkimi_room_api.dart';

/// Gerçek API'ye karşı uçtan uca sözleşme testi.
///
/// Neden var: API NestJS'ten Next.js route handler'larına taşınırken POST
/// yanıtları 201'den 200'e düştü. `home_screen.dart` `statusCode != 201`
/// kontrol ettiği için oda açma sessizce kırıldı ve mevcut widget testi bunu
/// göremedi — çünkü ağ çağrıları widget'ın içindeydi. Çağrılar artık
/// `KimKimiRoomApi`'de ve bu test uygulamanın kullandığı kodun aynısını
/// gerçek sunucuya karşı çalıştırıyor.
///
/// Çalıştırma (varsayılan olarak atlanır, ağ ister):
///   flutter test --tags live
/// Yerel sunucuya karşı:
///   flutter test --tags live --dart-define=API_BASE=http://127.0.0.1:3000/api
void main() {
  /// Soru tipine göre geçerli bir cevap üretir.
  /// `variant` 0 referans cevap, 1 ise kasten farklı cevap.
  Object answerFor(PublicQuestion q, int variant) {
    final choices = parseChoices(q.choicesJson);
    if (choices.isNotEmpty) {
      return variant == 0 ? choices.first.value : choices.last.value;
    }
    switch (q.type) {
      case 'number':
        return 3 + variant;
      case 'date':
        return variant == 0 ? '1995-06-15' : '1988-02-03';
      default:
        // Bulanık eşleştirme devrede: yalnızca aksan/yazım hatası affediliyor,
        // bu ikisi normalize edilince de apayrı kalır.
        return variant == 0 ? 'mavi' : 'yeşil';
    }
  }

  /// Farklı şık seçmenin gerçekten yanlış sayılacağı sorular.
  ///
  /// Şıkları tam olarak `Ben`/`O` olan karşılaştırma sorularında çift perspektif
  /// kuralı devrede: partner "Ben" dediyse tahmin "O" da doğrudur. Bu sorularda
  /// kasten yanlış cevap vermek mümkün değil, o yüzden testin dışında tutulurlar.
  bool canAnswerWrong(PublicQuestion q) {
    final choices = parseChoices(q.choicesJson);
    if (choices.isEmpty) return true;
    if (choices.length < 2) return false;
    final values = choices.map((c) => c.value).toSet();
    final isBenO = values.length == 2 && values.containsAll({'Ben', 'O'});
    return !isBenO;
  }

  test('kategoriler yükleniyor', () async {
    final cats = await KimKimiRoomApi.fetchCategories();
    expect(cats, isNotEmpty, reason: 'API $kApiBase adresinden kategori dönmedi');
    expect(cats.first['slug'], isA<String>());
    expect(cats.first['id'], isA<String>());
  }, timeout: const Timeout(Duration(seconds: 60)));

  test('tam oyun akışı: oda aç -> katıl -> profil -> 10 tur -> sonuç', () async {
    final cats = await KimKimiRoomApi.fetchCategories();
    final cat = cats.firstWhere((c) => c['slug'] == 'sevgili');
    final slug = cat['slug'] as String;

    // —— oda aç ——
    final created = await KimKimiRoomApi.createRoom(
      categoryId: cat['id'] as String,
      hostDisplayName: 'TestHost',
    );
    expect(created.shortCode, isNotEmpty);
    expect(created.hostPlayerToken, isNotEmpty);

    // —— katıl (küçük harfli kod da kabul edilmeli) ——
    final joined = await KimKimiRoomApi.joinRoom(
      shortCode: created.shortCode.toLowerCase(),
      guestDisplayName: 'TestGuest',
    );
    expect(joined.secretId, created.secretId);

    final host = KimKimiRoomApi(
      secretId: created.secretId,
      playerToken: created.hostPlayerToken,
    );
    final guest = KimKimiRoomApi(
      secretId: joined.secretId,
      playerToken: joined.guestPlayerToken,
    );

    var state = await host.getState();
    expect(state['status'], 'profile');
    expect(state['totalGameQuestions'], 10);

    // —— profil fazı ——
    final profileQs = await KimKimiRoomApi.fetchPublicQuestions(
      slug,
      'profile',
      secretId: created.secretId,
    );
    expect(profileQs.length, 10, reason: 'odaya özel profil soruları 10 olmalı');

    List<Map<String, dynamic>> answers(int variant) => profileQs
        .map((q) => {'questionId': q.id, 'value': answerFor(q, variant)})
        .toList();

    await host.submitProfileAnswers(answers(0));
    state = await host.getState();
    expect(state['status'], 'profile',
        reason: 'yalnız bir taraf bitirdiğinde oyun başlamamalı');

    await guest.submitProfileAnswers(answers(0));
    state = await host.getState();
    expect(state['status'], 'playing');

    // —— 10 tur ——
    final gameQs = await KimKimiRoomApi.fetchPublicQuestions(
      slug,
      'game',
      secretId: created.secretId,
    );
    expect(gameQs.length, 10);

    // Misafirin kasten yanlış cevaplayacağı turlar: en fazla 4 tane, yalnızca
    // farklı cevabın gerçekten yanlış sayılabileceği sorulardan.
    final wrongOnPurpose = gameQs.where(canAnswerWrong).take(4).map((q) => q.id).toSet();
    expect(wrongOnPurpose, isNotEmpty,
        reason: 'on sorunun tamamı Ben/O çifti çıktı — test ayrım yapamaz');

    for (var i = 0; i < 10; i++) {
      state = await host.getState();
      expect(state['currentQuestionIndex'], i);
      final qid = state['currentQuestionId'] as String;
      final q = gameQs.firstWhere((x) => x.id == qid);

      await host.submitGameAnswer(qid, answerFor(q, 0));
      state = await host.getState();
      expect(state['currentQuestionIndex'], i,
          reason: 'tur yalnız tek cevapla ilerlememeli');

      await guest.submitGameAnswer(qid, answerFor(q, wrongOnPurpose.contains(qid) ? 1 : 0));
    }

    state = await host.getState();
    expect(state['status'], 'finished');

    // —— sonuç ——
    final results = await host.getResults() as Map<String, dynamic>;
    final perPlayer = results['perPlayer'] as List<dynamic>;
    expect(perPlayer.length, 2);
    final hostScore = perPlayer.firstWhere((p) => p['seat'] == 'host');
    final guestScore = perPlayer.firstWhere((p) => p['seat'] == 'guest');
    expect(hostScore['max'], 10);
    expect(hostScore['score'], 10, reason: 'aynı cevaplar tam puan vermeli');
    expect(guestScore['score'], 10 - wrongOnPurpose.length,
        reason: 'kasten farklı verilen ${wrongOnPurpose.length} cevap puan kaybettirmeli');
    expect(results['winnerSeat'], 'host');
  }, timeout: const Timeout(Duration(minutes: 3)));

  test('geçersiz oda kodu hata fırlatır', () async {
    await expectLater(
      KimKimiRoomApi.joinRoom(shortCode: 'ZZZZZZ', guestDisplayName: 'X'),
      throwsA(isA<StateException>()),
    );
  }, timeout: const Timeout(Duration(seconds: 60)));

  test('geçersiz oyuncu token’ı 401 verir', () async {
    final cats = await KimKimiRoomApi.fetchCategories();
    final created = await KimKimiRoomApi.createRoom(
      categoryId: cats.first['id'] as String,
      hostDisplayName: 'TokenTest',
    );
    final bogus = KimKimiRoomApi(secretId: created.secretId, playerToken: 'yanlis');
    await expectLater(
      bogus.getState(),
      throwsA(isA<StateException>().having((e) => e.statusCode, 'statusCode', 401)),
    );
  }, timeout: const Timeout(Duration(seconds: 60)));
}
