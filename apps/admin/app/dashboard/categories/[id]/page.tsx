import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-api';
import { deleteCategory, updateCategory } from '../actions';

type Category = {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
  active: boolean;
};

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const r = await serverFetch(`/admin/categories/${params.id}`);
  if (r.status === 404) notFound();
  if (!r.ok) return <p>Hata {r.status}</p>;
  const c = (await r.json()) as Category;

  const updateWithId = updateCategory.bind(null, c.id);
  const deleteWithId = deleteCategory.bind(null, c.id);

  return (
    <div>
      <Link href="/dashboard/categories" className="text-sm text-blue-600 underline">
        ← Kategoriler
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Kategori: {c.slug}</h1>
      <form action={updateWithId} className="mt-4 flex max-w-md flex-col gap-3">
        <label className="text-sm">
          Başlık
          <input name="title" required defaultValue={c.title} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Sıra
          <input
            name="sortOrder"
            type="number"
            defaultValue={c.sortOrder}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Durum
          <select name="active" defaultValue={c.active ? 'true' : 'false'} className="mt-1 w-full rounded border px-3 py-2">
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Güncelle
        </button>
      </form>
      <form action={deleteWithId} className="mt-8">
        <button type="submit" className="text-sm text-red-600 underline">
          Sil
        </button>
      </form>
    </div>
  );
}
