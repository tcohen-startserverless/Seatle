import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { personKeys } from './keys';
import { Schemas } from '@core/schema';
import type { PersonItem } from '@core/person';

export const useGetPerson = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  
  return useQuery<PersonItem | null, Error>({
    queryKey: personKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person[':id'].$get({
        param: params,
      });
      return res.json();
    },
    enabled: !!client && !clientLoading,
  });
};

export const useListPersons = (params?: Schemas.Types.Pagination) => {
  const { client, isLoading: clientLoading } = useApiClient();
  
  return useQuery<{ data: PersonItem[]; cursor?: string }, Error>({
    queryKey: personKeys.list(params),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person.$get({
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      const result = await res.json();
      return {
        data: result.data,
        cursor: result.cursor || undefined,
      };
    },
    enabled: !!client && !clientLoading,
  });
};
