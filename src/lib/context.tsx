'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ThemeName } from '@/lib/themes';
import { themes } from '@/lib/themes';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeName>('neon');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('academy-theme') as ThemeName;
    if (storedTheme && themes.find(t => t.id === storedTheme)) {
      setTheme(storedTheme);
    }

    const storedUser = localStorage.getItem('academy-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('academy-user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = `${theme} cyber-bg`;
    document.body.style.margin = '0';
    localStorage.setItem('academy-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('academy-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('academy-user');
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
