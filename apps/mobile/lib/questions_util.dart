import 'models/public_question.dart';

/// Web `sortQuestions` ile aynı: `orderIndex` artan sıra.
List<PublicQuestion> sortPublicQuestions(List<PublicQuestion> qs) {
  final copy = [...qs];
  copy.sort((a, b) => (a.orderIndex ?? 0).compareTo(b.orderIndex ?? 0));
  return copy;
}

Map<String, dynamic> asStringKeyMap(dynamic raw) {
  if (raw == null || raw is! Map) return {};
  return raw.map((k, v) => MapEntry(k.toString(), v));
}

/// `choicesJson` dizisinden şıkları okur. Havuzda iki biçim var:
/// düz string (`["Ben","O"]`) ve nesne (`[{"value":"a","label":"A"}]`).
/// Web `parseChoices` ile aynı kurallar.
List<({String label, String value})> parseChoices(dynamic raw) {
  if (raw == null || raw is! List) return [];
  final out = <({String label, String value})>[];
  for (final e in raw) {
    if (e is String) {
      out.add((label: e, value: e));
    } else if (e is Map) {
      final m = asStringKeyMap(e);
      final v = m['value'] ?? m['id'] ?? m['key'];
      final l = m['label'] ?? m['title'] ?? v;
      if (v != null) {
        out.add((label: l.toString(), value: v.toString()));
      }
    }
  }
  return out;
}

/// Serbest metin cevaplarındaki kelime tavanı için: soru metin girdisi mi bekliyor?
/// Şıkları olan single_choice, number, date ve multi_choice hariç hepsi metindir.
bool questionNeedsShortAnswer(PublicQuestion q) {
  if (q.type == 'number' || q.type == 'date' || q.type == 'multi_choice') return false;
  if (q.type == 'single_choice' && parseChoices(q.choicesJson).isNotEmpty) return false;
  return true;
}

int countWords(String s) =>
    s.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).length;
