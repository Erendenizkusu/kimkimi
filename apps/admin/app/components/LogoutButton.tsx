'use client';

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-sm text-zinc-600 underline"
      onClick={async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      }}
    >
      Çıkış
    </button>
  );
}
