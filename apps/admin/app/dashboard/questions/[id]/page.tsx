import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-api';
import { deleteQuestion, updateQuestion } from '../actions';

type Question = {
  id: string;
  categoryId: string;
  phase: string;
  type: string;
  prompt: string;
  orderIndex: number;
  weight: number;
  status: string;
  mapsToQuestionId: string | null;
  choicesJson: unknown;
};

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { categoryId?: string };
}) {
  const r = await serverFetch(`/admin/questions/${params.id}`);
  if (r.status === 404) notFound();
  if (!r.ok) return <p>Hata {r.status}</p>;
  const q = (await r.json()) as Question;
  const categoryId = searchParams.categoryId ?? q.categoryId;

  const upd = updateQuestion.bind(null, q.id);
  const del = deleteQuestion.bind(null, q.id, categoryId);

  return (
    <div>
      <Link href={`/dashboard/questions?categoryId=${categoryId}`} className="text-sm text-blue-600 underline">
        ← Sorular
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Soru düzenle</h1>
      <form action={upd} className="mt-4 flex max-w-lg flex-col gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <label className="text-sm">
          Faz
          <select name="phase" defaultValue={q.phase} className="mt-1 w-full rounded border px-3 py-2">
            <option value="profile">profile</option>
            <option value="game">game</option>
          </select>
        </label>
        <label className="text-sm">
          Tip
          <select name="type" defaultValue={q.type} className="mt-1 w-full rounded border px-3 py-2">
            <option value="text">text</option>
            <option value="single_choice">single_choice</option>
            <option value="multi_choice">multi_choice</option>
            <option value="date">date</option>
            <option value="number">number</option>
          </select>
        </label>
        <label className="text-sm">
          Metin
          <textarea name="prompt" required rows={3} defaultValue={q.prompt} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Şıklar (JSON dizi)
          <span className="mt-0.5 block text-xs font-normal text-neutral-500">
            {`single_choice / multi_choice için örn. ["Şık A", "Şık B"]. Metin soruda boş bırakın.`}
          </span>
          <textarea
            name="choicesJson"
            rows={8}
            spellCheck={false}
            defaultValue={q.choicesJson != null ? JSON.stringify(q.choicesJson, null, 2) : ''}
            className="mt-1 w-full rounded border px-3 py-2 font-mono text-sm"
            placeholder='["Şık 1", "Şık 2"]'
          />
        </label>
        <label className="text-sm">
          Sıra
          <input name="orderIndex" type="number" defaultValue={q.orderIndex} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Ağırlık
          <input name="weight" type="number" defaultValue={q.weight} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Yayın
          <select name="status" defaultValue={q.status} className="mt-1 w-full rounded border px-3 py-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="text-sm">
          mapsToQuestionId
          <input
            name="mapsToQuestionId"
            defaultValue={q.mapsToQuestionId ?? ''}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Güncelle
        </button>
      </form>
      <form action={del} className="mt-8">
        <button type="submit" className="text-sm text-red-600 underline">
          Sil
        </button>
      </form>
    </div>
  );
}
