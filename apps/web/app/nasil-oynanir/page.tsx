import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nasıl oynanır',
};

export default function HowToPage() {
  return (
    <article className="doc-article">
      <h1>Nasıl oynanır</h1>
      <ol>
        <li>Uygulamayı açın ve bir kategori seçin (ör. sevgili, arkadaş).</li>
        <li>Bir oyuncu oda oluşturur; diğeri kısa kod veya QR ile katılır.</li>
        <li>Önce herkes kendi hakkında profil sorularını cevaplar.</li>
        <li>Oyun başlar: aynı sorular sırayla gelir; her iki taraf da cevaplayana kadar tur ilerlemez.</li>
        <li>Sonunda doğru / yanlış ve kim kimi daha çok tanıyor skorunu görürsünüz.</li>
      </ol>
    </article>
  );
}
