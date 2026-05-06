import Link from 'next/link';
import { serverFetch } from '@/lib/server-api';

type Category = { id: string; slug: string; title: string };
type Question = {
  id: string;
  phase: string;
  type: string;
  prompt: string;
  orderIndex: number;
  status: string;
  mapsToQuestionId: string | null;
};

export default async function QuestionsPage({ searchParams }: { searchParams: { categoryId?: string } }) {
  const catRes = await serverFetch('/admin/categories');
  const categories = (await catRes.json()) as Category[];

  const categoryId = searchParams.categoryId ?? categories[0]?.id;
  if (!categoryId) {
    return <p>Önce bir kategori oluşturun.</p>;
  }

  const qRes = await serverFetch(`/admin/questions?categoryId=${encodeURIComponent(categoryId)}`);
  const questions = qRes.ok ? ((await qRes.json()) as Question[]) : [];

  return (
    <div>
      <h1 className="text-xl font-semibold">Sorular</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/questions?categoryId=${c.id}`}
            className={`rounded border px-3 py-1 text-sm ${c.id === categoryId ? 'bg-black text-white' : 'bg-white'}`}
          >
            {c.title}
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Link
          href={`/dashboard/questions/new?categoryId=${encodeURIComponent(categoryId)}`}
          className="inline-block rounded bg-black px-3 py-1.5 text-sm text-white"
        >
          Yeni soru
        </Link>
      </div>
      <ul className="mt-4 divide-y rounded border bg-white">
        {questions.map((q) => (
          <li key={q.id} className="flex items-start justify-between gap-2 px-3 py-2">
            <div>
              <div className="text-sm font-medium">
                {q.phase} / {q.status}
              </div>
              <div className="text-sm text-zinc-700">{q.prompt}</div>
              {q.mapsToQuestionId && (
                <div className="text-xs text-zinc-500">mapsTo: {q.mapsToQuestionId}</div>
              )}
            </div>
            <Link href={`/dashboard/questions/${q.id}?categoryId=${categoryId}`} className="text-sm text-blue-600 underline">
              Düzenle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
