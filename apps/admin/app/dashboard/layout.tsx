import Link from 'next/link';
import { LogoutButton } from '../components/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex flex-wrap gap-4 text-sm font-medium">
            <Link href="/dashboard">Özet</Link>
            <Link href="/dashboard/categories">Kategoriler</Link>
            <Link href="/dashboard/questions">Sorular</Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
    </div>
  );
}
