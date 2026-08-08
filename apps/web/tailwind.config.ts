import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-dm-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        kk: {
          page: 'var(--kk-page)',
          fg: 'var(--kk-fg)',
          'fg-soft': 'var(--kk-fg-soft)',
          muted: 'var(--kk-muted)',
          'muted-strong': 'var(--kk-muted-strong)',
          border: 'var(--kk-border)',
          'border-strong': 'var(--kk-border-strong)',
          surface: 'var(--kk-surface)',
          'surface-muted': 'var(--kk-surface-muted)',
          'surface-elevated': 'var(--kk-surface-elevated)',
          input: 'var(--kk-input-bg)',
          code: 'var(--kk-code-bg)',
          header: 'var(--kk-header-bg)',
          logo: 'var(--kk-logo)',
          'logo-hover': 'var(--kk-logo-hover)',
          'nav-cta': 'var(--kk-nav-cta)',
          'gif-card': 'var(--kk-gif-card)',
          modal: 'var(--kk-modal-bg)',
          check: 'var(--kk-check-bg)',
          footer: 'var(--kk-footer-text)',
          'input-text': 'var(--kk-input-text)',
          'input-placeholder': 'var(--kk-input-placeholder)',
          'chip-violet-fg': 'var(--kk-chip-violet-fg)',
          'on-violet-fg': 'var(--kk-on-violet-fg)',
          link: 'var(--kk-link)',
          'link-hover': 'var(--kk-link-hover)',
          accent: 'var(--kk-accent)',
        },
      },
      keyframes: {
        'aurora-shift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(8%, -4%) scale(1.08)' },
        },
        'aurora-shift-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-10%, 6%) scale(1.06)' },
        },
        'hero-kenburns': {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'aurora-shift': 'aurora-shift 22s ease-in-out infinite',
        'aurora-shift-reverse': 'aurora-shift-reverse 26s ease-in-out infinite',
        'hero-kenburns': 'hero-kenburns 28s ease-in-out alternate infinite',
        'fade-in-up': 'fade-in-up 0.65s ease-out forwards',
        'soft-pulse': 'soft-pulse 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
