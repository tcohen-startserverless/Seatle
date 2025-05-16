import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage persister for React Native
 */
export function createAsyncStoragePersister({
  key = 'SEATER_QUERY_CACHE',
  throttleTime = 1000,
}: {
  key?: string;
  throttleTime?: number;
} = {}) {
  let pendingSavePromise: Promise<void> | null = null;
  let lastSaveAt = 0;

  return {
    persistClient: async (persistClient: PersistedClient): Promise<void> => {
      // Throttle saving to avoid excessive writes
      const now = Date.now();
      if (now - lastSaveAt < throttleTime) {
        if (!pendingSavePromise) {
          pendingSavePromise = new Promise<void>((resolve) => {
            setTimeout(async () => {
              await AsyncStorage.setItem(key, JSON.stringify(persistClient));
              pendingSavePromise = null;
              lastSaveAt = Date.now();
              resolve();
            }, throttleTime);
          });
        }
        return pendingSavePromise;
      }

      lastSaveAt = now;
      await AsyncStorage.setItem(key, JSON.stringify(persistClient));
    },

    restoreClient: async (): Promise<PersistedClient | undefined> => {
      const persistedClientString = await AsyncStorage.getItem(key);
      if (persistedClientString) {
        try {
          return JSON.parse(persistedClientString);
        } catch (error) {
          await AsyncStorage.removeItem(key);
          return undefined;
        }
      }
      return undefined;
    },

    removeClient: async (): Promise<void> => {
      await AsyncStorage.removeItem(key);
    },
  } as Persister;
}

// Default persister instance with standard configuration
export const asyncStoragePersister = createAsyncStoragePersister();

/**
 * Utility to clear the persisted cache and in-memory query cache
 * Useful for scenarios like user logout
 * 
 * @param client The QueryClient instance
 * @param persister Optional custom persister (uses default if not specified)
 */
export async function clearPersistedCache(
  client: import('@tanstack/react-query').QueryClient,
  persister = asyncStoragePersister
): Promise<void> {
  // Clear the in-memory cache
  await client.resetQueries();
  client.clear();
  
  // Remove the persisted cache
  await persister.removeClient();
}