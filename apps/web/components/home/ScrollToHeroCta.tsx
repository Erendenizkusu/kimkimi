'use client';

type Props = {
  className?: string;
  children: React.ReactNode;
};

/** Aynı sayfada kahraman bölümüne kaydırır (sticky başlık için offset). */
export function ScrollToHeroCta({ className, children }: Props) {
  return (
    <a
      href="#ana-hero"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('ana-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      {children}
    </a>
  );
}
