import React, { ReactNode, useState, useContext } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './queryClient';
import { asyncStoragePersister } from './persistence';

// Create a context for tracking restoration state
const RestoringContext = React.createContext<boolean>(false);

// Custom hook to check if we're restoring
export const useIsRestoring = () => useContext(RestoringContext);

interface QueryPersistenceProviderProps {
  children: ReactNode;
  onSuccess?: () => Promise<unknown> | unknown;
  onError?: () => Promise<unknown> | unknown;
}

/**
 * Provider that wraps the application to enable query persistence
 * This will persist and restore the React Query cache using AsyncStorage
 */
export function QueryPersistenceProvider({
  children,
  onSuccess,
  onError,
}: QueryPersistenceProviderProps) {
  const [isRestoring, setIsRestoring] = useState(true);
  
  const handleSuccess = async () => {
    if (onSuccess) {
      await onSuccess();
    }
    setIsRestoring(false);
  };
  
  const handleError = async () => {
    if (onError) {
      await onError();
    }
    setIsRestoring(false);
  };
  
  return (
    <RestoringContext.Provider value={isRestoring}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          buster: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
        }}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {children}
      </PersistQueryClientProvider>
    </RestoringContext.Provider>
  );
}

/**
 * Hook to check if the query client is currently restoring from persistence
 * Useful for showing loading indicators while restoring
 * @returns boolean indicating if restoration is in progress
 */

/**
 * Default export for convenience
 */
export default QueryPersistenceProvider;