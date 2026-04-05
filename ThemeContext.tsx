import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Force light mode always - professional static design
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Always remove dark class to ensure light mode
    document.documentElement.classList.remove('dark');
    
    // Save to localStorage
    localStorage.setItem('tasktogether-theme', 'light');
  }, [theme]);

  const toggleTheme = () => {
    // Disabled - always stay in light mode for professional design
    // setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};