import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik politikası',
};

export default function PrivacyPage() {
  return (
    <article className="doc-article">
      <h1>Gizlilik politikası</h1>
      <p>
        Bu sayfa KVKK kapsamında bilgilendirme metni için yer tutucudur. Yayın öncesi hukuk danışmanlığı ile
        güncellenmelidir.
      </p>
      <ul>
        <li>Toplanan veriler: oda kodu, oyun cevapları ve teknik günlükler (ör. hata ayıklama).</li>
        <li>Amaç: oyunu çalıştırmak ve hizmeti iyileştirmek.</li>
        <li>Saklama: odalar ve cevaplar için süre politikası API tarafında tanımlanır.</li>
      </ul>
    </article>
  );
}
