type KimKimiMarkProps = {
  size?: number;
  className?: string;
};

/** Ortak marka SVG (`/public/brand/kimkimi-mark.svg`). Mobil `assets/brand/kimkimi_mark.svg` ile aynı. */
export function KimKimiMark({ size = 36, className }: KimKimiMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- statik SVG marka; next/image SVG için ek yapı gerekir
    <img
      src="/brand/kimkimi-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className ?? 'shrink-0 select-none'}
      decoding="async"
      aria-hidden
    />
  );
}
