import 'package:flutter/material.dart';

import '../widgets/kk_surface_card.dart';

/// Web `/nasil-oynanir` ile aynı içerik.
class HowToPlayScreen extends StatelessWidget {
  const HowToPlayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nasıl oynanır')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          KkSurfaceCard(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Nasıl oynanır', style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 16),
                _numbered(
                  context,
                  1,
                  'Uygulamayı açın ve bir kategori seçin (ör. sevgili, arkadaş).',
                ),
                _numbered(
                  context,
                  2,
                  'Bir oyuncu oda oluşturur; diğeri kısa kod ile katılır.',
                ),
                _numbered(
                  context,
                  3,
                  'Önce herkes kendi hakkında profil sorularını cevaplar.',
                ),
                _numbered(
                  context,
                  4,
                  'Oyun başlar: aynı sorular sırayla gelir; her iki taraf da cevaplayana kadar tur ilerlemez.',
                ),
                _numbered(
                  context,
                  5,
                  'Sonunda doğru / yanlış ve kim kimi daha çok tanıyor skorunu görürsünüz.',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

Widget _numbered(BuildContext context, int n, String text) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 14,
          child: Text('$n', style: const TextStyle(fontSize: 12)),
        ),
        const SizedBox(width: 12),
        Expanded(child: Text(text, style: Theme.of(context).textTheme.bodyLarge)),
      ],
    ),
  );
}

/// Web `/gizlilik` ile aynı içerik.
class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gizlilik politikası')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          KkSurfaceCard(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Gizlilik politikası', style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                Text(
                  'Bu sayfa KVKK kapsamında bilgilendirme metni için yer tutucudur. Yayın öncesi hukuk danışmanlığı ile güncellenmelidir.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 16),
                Text('Özet', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Text(
                  '• Toplanan veriler: oda kodu, oyun cevapları ve teknik günlükler (ör. hata ayıklama).\n'
                  '• Amaç: oyunu çalıştırmak ve hizmeti iyileştirmek.\n'
                  '• Saklama: odalar ve cevaplar için süre politikası API tarafında tanımlanır.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Web `/kullanim` ile aynı içerik.
class TermsOfUseScreen extends StatelessWidget {
  const TermsOfUseScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kullanım şartları')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          KkSurfaceCard(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Kullanım şartları', style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                Text(
                  'Hizmeti kullanarak bu şartları kabul etmiş sayılırsınız. Metin yayın öncesi güncellenecektir. '
                  'Uygunsuz içerik oluşturmaktan kaçının; hesap veya oda erişimi ihlal halinde kısıtlanabilir.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.45),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
