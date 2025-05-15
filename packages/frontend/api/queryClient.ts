import { QueryClient, keepPreviousData } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: true,
      placeholderData: keepPreviousData,
      refetchOnMount: 'always',
    },
  },
});
