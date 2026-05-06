import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım şartları',
};

export default function TermsPage() {
  return (
    <article className="doc-article">
      <h1>Kullanım şartları</h1>
      <p>
        Hizmeti kullanarak bu şartları kabul etmiş sayılırsınız. Metin yayın öncesi güncellenecektir. Uygunsuz içerik
        oluşturmaktan kaçının; hesap veya oda erişimi ihlal halinde kısıtlanabilir.
      </p>
    </article>
  );
}
