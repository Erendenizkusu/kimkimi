'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type KimkimiTheme = 'dark' | 'light';

const STORAGE_KEY = 'kimkimi-theme';

type Ctx = {
  theme: KimkimiTheme;
  setTheme: (t: KimkimiTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export function useKimkimiTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useKimkimiTheme yalnızca ThemeProvider içinde kullanılabilir');
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<KimkimiTheme>('dark');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const t: KimkimiTheme = raw === 'light' ? 'light' : 'dark';
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const setTheme = useCallback((t: KimkimiTheme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: KimkimiTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}
