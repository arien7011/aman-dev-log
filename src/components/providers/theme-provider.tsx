'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Helper to get initial theme from localStorage
function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = localStorage.getItem(storageKey) as Theme | null;
  return stored || defaultTheme;
}

// Helper to resolve theme
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'amandevlog-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme));

  // Use useSyncExternalStore for hydration-safe mounting
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Apply theme to document
  useEffect(() => {
    if (!isMounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    const resolved = resolveTheme(theme);
    root.classList.add(resolved);
  }, [theme, isMounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!isMounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isMounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const toggleTheme = () => {
    const resolved = resolveTheme(theme);
    const newTheme = resolved === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const resolvedTheme = isMounted ? resolveTheme(theme) : 'light';

  // Prevent flash of incorrect theme
  if (!isMounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: defaultTheme,
          resolvedTheme: 'light',
          setTheme: () => {},
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
