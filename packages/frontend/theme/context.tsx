import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemeConfig } from './types';
import { lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  theme: ThemeConfig;
  colorScheme: 'light' | 'dark' | null;
  setColorScheme: (colorScheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  colorScheme: 'light',
  setColorScheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | null>(
    deviceColorScheme || 'light'
  );

  useEffect(() => {
    if (deviceColorScheme) {
      setColorScheme(deviceColorScheme);
    }
  }, [deviceColorScheme]);

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);