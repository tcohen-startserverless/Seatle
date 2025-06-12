import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeConfig } from './types';
import { lightTheme, darkTheme } from './theme';

interface ThemeContextType {
  theme: ThemeConfig;
  colorScheme: 'light' | 'dark' | null;
  setColorScheme: (colorScheme: 'light' | 'dark' | 'auto') => void;
  isManualOverride: boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  colorScheme: 'light',
  setColorScheme: () => {},
  isManualOverride: false,
  isLoading: true,
});

const THEME_STORAGE_KEY = 'user_theme_preference';

const themeEvents = new EventTarget();
export const THEME_CHANGED = 'theme_changed';
export const notifyThemeChange = (theme: ThemeConfig) => {
  themeEvents.dispatchEvent(new CustomEvent(THEME_CHANGED, { detail: theme }));
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | null>(null);
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | 'auto' | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const preference = saved as 'light' | 'dark' | 'auto' | null;
        setUserPreference(preference || 'auto');

        if (preference === 'auto' || !preference) {
          setColorScheme(deviceColorScheme || 'light');
        } else {
          setColorScheme(preference);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setUserPreference('auto');
        setColorScheme(deviceColorScheme || 'light');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [deviceColorScheme]);

  useEffect(() => {
    if (userPreference === 'auto' && deviceColorScheme) {
      setColorScheme(deviceColorScheme);
    }
  }, [deviceColorScheme, userPreference]);

  const handleSetColorScheme = useCallback(
    async (newScheme: 'light' | 'dark' | 'auto') => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
        setUserPreference(newScheme);

        if (newScheme === 'auto') {
          setColorScheme(deviceColorScheme || 'light');
        } else {
          setColorScheme(newScheme);
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    },
    [deviceColorScheme]
  );

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const isManualOverride = userPreference !== 'auto' && userPreference !== null;

  useEffect(() => {
    if (!isLoading) {
      notifyThemeChange(theme);
    }
  }, [theme, isLoading]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        setColorScheme: handleSetColorScheme,
        isManualOverride,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const useThemeListener = (callback: (theme: ThemeConfig) => void) => {
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeConfig>;
      callback(customEvent.detail);
    };

    themeEvents.addEventListener(THEME_CHANGED, handleThemeChange);
    return () => {
      themeEvents.removeEventListener(THEME_CHANGED, handleThemeChange);
    };
  }, [callback]);
};
