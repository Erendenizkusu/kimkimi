import Link from 'next/link';
import { createQuestion } from '../actions';

export default function NewQuestionPage({ searchParams }: { searchParams: { categoryId?: string } }) {
  const categoryId = searchParams.categoryId ?? '';
  if (!categoryId) {
    return (
      <p>
        Kategori seçin: <Link href="/dashboard/questions">Sorular</Link>
      </p>
    );
  }

  return (
    <div>
      <Link href={`/dashboard/questions?categoryId=${categoryId}`} className="text-sm text-blue-600 underline">
        ← Sorular
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Yeni soru</h1>
      <form action={createQuestion} className="mt-4 flex max-w-lg flex-col gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <label className="text-sm">
          Faz
          <select name="phase" className="mt-1 w-full rounded border px-3 py-2" defaultValue="profile">
            <option value="profile">profile</option>
            <option value="game">game</option>
          </select>
        </label>
        <label className="text-sm">
          Tip
          <select name="type" className="mt-1 w-full rounded border px-3 py-2" defaultValue="text">
            <option value="text">text</option>
            <option value="single_choice">single_choice</option>
            <option value="multi_choice">multi_choice</option>
            <option value="date">date</option>
            <option value="number">number</option>
          </select>
        </label>
        <label className="text-sm">
          Metin
          <textarea name="prompt" required rows={3} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Şıklar (JSON dizi)
          <span className="mt-0.5 block text-xs font-normal text-neutral-500">
            single_choice / multi_choice için. Metin soruda boş bırakın.
          </span>
          <textarea
            name="choicesJson"
            rows={8}
            spellCheck={false}
            className="mt-1 w-full rounded border px-3 py-2 font-mono text-sm"
            placeholder='["Şık 1", "Şık 2"]'
          />
        </label>
        <label className="text-sm">
          Sıra
          <input name="orderIndex" type="number" defaultValue={0} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Ağırlık
          <input name="weight" type="number" defaultValue={1} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Yayın
          <select name="status" className="mt-1 w-full rounded border px-3 py-2" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="text-sm">
          mapsToQuestionId (oyun sorusu için profil soru id)
          <input name="mapsToQuestionId" className="mt-1 w-full rounded border px-3 py-2" placeholder="UUID veya boş" />
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Kaydet
        </button>
      </form>
    </div>
  );
}
