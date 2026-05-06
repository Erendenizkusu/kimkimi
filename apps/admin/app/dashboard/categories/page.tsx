import Link from 'next/link';
import { serverFetch } from '@/lib/server-api';

type Category = {
  id: string;
  slug: string;
  title: string;
  sortOrder: number;
  active: boolean;
};

export default async function CategoriesPage() {
  const r = await serverFetch('/admin/categories');
  if (!r.ok) {
    return <p className="text-red-600">Kategoriler yüklenemedi ({r.status})</p>;
  }
  const list = (await r.json()) as Category[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kategoriler</h1>
        <Link
          href="/dashboard/categories/new"
          className="rounded bg-black px-3 py-1.5 text-sm text-white"
        >
          Yeni
        </Link>
      </div>
      <ul className="divide-y rounded border bg-white">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 px-3 py-2">
            <div>
              <span className="font-medium">{c.title}</span>
              <span className="ml-2 text-sm text-zinc-500">{c.slug}</span>
              {!c.active && <span className="ml-2 text-xs text-amber-600">pasif</span>}
            </div>
            <Link href={`/dashboard/categories/${c.id}`} className="text-sm text-blue-600 underline">
              Düzenle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
