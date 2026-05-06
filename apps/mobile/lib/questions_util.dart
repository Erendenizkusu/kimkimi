import 'models/public_question.dart';

/// Web `sortQuestions` ile aynı: `orderIndex` artan sıra.
List<PublicQuestion> sortPublicQuestions(List<PublicQuestion> qs) {
  final copy = [...qs];
  copy.sort((a, b) => (a.orderIndex ?? 0).compareTo(b.orderIndex ?? 0));
  return copy;
}
