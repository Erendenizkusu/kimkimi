/**
 * Tüm sayfalarda sabit, hafif hareketli mesh — içerik üstte (z-index) kalır.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--kk-ambient-base)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,var(--kk-ambient-radial),transparent_50%)]" />
      <div
        className="absolute -left-[20%] top-1/4 h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full blur-[100px] motion-safe:animate-aurora-shift"
        style={{ backgroundColor: 'var(--kk-ambient-blob-left)' }}
      />
      <div
        className="absolute -right-[15%] bottom-0 h-[min(60vw,420px)] w-[min(60vw,420px)] rounded-full blur-[90px] motion-safe:animate-aurora-shift-reverse"
        style={{ backgroundColor: 'var(--kk-ambient-blob-right)' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--kk-ambient-bottom))]" />
    </div>
  );
}
