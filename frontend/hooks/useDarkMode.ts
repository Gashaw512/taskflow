// src/hooks/useDarkMode.ts
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedPreference = localStorage.getItem('isDarkMode');
    return storedPreference !== null
      ? storedPreference === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('isDarkMode', JSON.stringify(newValue));
  };

  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.classList.toggle('dark', isDarkMode);
    };
    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const mediaListener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('isDarkMode')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', mediaListener);
    return () => mediaQuery.removeEventListener('change', mediaListener);
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};