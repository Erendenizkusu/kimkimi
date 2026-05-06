import 'package:flutter_test/flutter_test.dart';
import 'package:kimkimi_mobile/main.dart';

void main() {
  testWidgets('Ana ekran başlığı', (WidgetTester tester) async {
    await tester.pumpWidget(const KimKimiApp());
    expect(find.text('KimKimi'), findsOneWidget);
  });
}
