import Link from 'next/link';
import { createCategory } from '../actions';

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/dashboard/categories" className="text-sm text-blue-600 underline">
        ← Kategoriler
      </Link>
      <h1 className="mt-4 text-xl font-semibold">Yeni kategori</h1>
      <form action={createCategory} className="mt-4 flex max-w-md flex-col gap-3">
        <label className="text-sm">
          Slug (küçük harf, tire)
          <input name="slug" required className="mt-1 w-full rounded border px-3 py-2" placeholder="ornek-kategori" />
        </label>
        <label className="text-sm">
          Başlık
          <input name="title" required className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Sıra
          <input name="sortOrder" type="number" defaultValue={0} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Durum
          <select name="active" defaultValue="true" className="mt-1 w-full rounded border px-3 py-2">
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Kaydet
        </button>
      </form>
    </div>
  );
}
