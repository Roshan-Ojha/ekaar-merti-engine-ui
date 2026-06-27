import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newDarkMode = e.matches;

      setIsDarkMode(newDarkMode);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDarkMode;
};
