import { QueryClient, keepPreviousData } from '@tanstack/react-query';

// Create a client with extended gc time for persistence support
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: true,
      placeholderData: keepPreviousData,
      refetchOnMount: 'always',
      gcTime: 1000 * 60 * 60 * 24 * 7,
    },
  },
});
