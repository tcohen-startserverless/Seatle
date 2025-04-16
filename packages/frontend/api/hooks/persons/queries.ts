import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { personKeys } from './keys';
import { Schemas } from '@core/schema';
import type { PersonItem, PersonQueryResponse } from '@core/person';

export const useGetPerson = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  const queryClient = useQueryClient();

  return useQuery<PersonItem | null, Error>({
    queryKey: personKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person[':id'].$get({
        param: params,
      });
      return res.json();
    },
    placeholderData: () => {
      const personsData = queryClient.getQueryData<{ data: PersonItem[] }>(
        personKeys.persons()
      );
      const cachedPerson = personsData?.data?.find((item) => item.id === params.id);
      if (cachedPerson) {
        return cachedPerson;
      }
      return null;
    },
    staleTime: 30 * 1000,
    refetchOnMount: true,
    enabled: !!client && !clientLoading,
  });
};

export const useListPersons = (
  params: Schemas.Types.Pagination & Schemas.Types.Params
) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<PersonQueryResponse, Error>({
    queryKey: personKeys.list(params),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person.$get({
        query: {
          cursor: params.cursor,
          limit: params.limit?.toString(),
        },
        param: {
          id: params.id,
        },
      });
      return await res.json();
    },
    enabled: !!client && !clientLoading,
  });
};
