import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hc } from 'hono/client';
import type { App } from '@functions/api';
import { AuthStorage } from '../auth/client';
import { AUTH_CHANGED, authEvents } from '../hooks/useAuth';
import { useThemeListener } from '../theme/context';

type ApiClientType = ReturnType<typeof hc<App>>;

interface ApiClientContextType {
  client: ApiClientType | null;
  isLoading: boolean;
  error: Error | null;
}

const ApiClientContext = createContext<ApiClientContextType>({
  client: null,
  isLoading: true,
  error: null,
});

interface ApiClientProviderProps {
  children: ReactNode;
}

export const ApiClientProvider: React.FC<ApiClientProviderProps> = ({ children }) => {
  const [state, setState] = useState<ApiClientContextType>({
    client: null,
    isLoading: true,
    error: null,
  });

  // Force re-render on theme changes for immediate UI updates
  const [, forceUpdate] = useState({});

  useThemeListener(() => {
    forceUpdate({});
  });

  useEffect(() => {
    const initClient = async () => {
      try {
        const tokens = await AuthStorage.getTokens();
        if (!tokens.access) {
          setState({
            client: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        const apiClient = hc<App>(process.env.EXPO_PUBLIC_API_URL, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        setState({
          client: apiClient,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          client: null,
          isLoading: false,
          error:
            error instanceof Error ? error : new Error('Failed to initialize API client'),
        });
      }
    };

    const handleAuthChange = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      initClient();
    };

    authEvents.addEventListener(AUTH_CHANGED, handleAuthChange);
    initClient();

    return () => {
      authEvents.removeEventListener(AUTH_CHANGED, handleAuthChange);
    };
  }, []);

  return <ApiClientContext.Provider value={state}>{children}</ApiClientContext.Provider>;
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);

  if (context === undefined) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }

  if (context.error) {
    throw context.error;
  }

  return {
    client: context.client,
    isLoading: context.isLoading,
  };
};
