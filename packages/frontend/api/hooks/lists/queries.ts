import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { listKeys } from './keys';
import { Schemas } from '@core/schema';
import { ListSchemas } from '@core/list';
import type { ListItem, CompleteList, ListQueryResponse } from '@core/list';

export const useGetList = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  const queryClient = useQueryClient();

  return useQuery<CompleteList | null, Error>({
    queryKey: listKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.list[':id'].$get({
        param: params,
      });
      return res.json();
    },
    placeholderData: () => {
      const listsData = queryClient.getQueryData<{ data: ListItem[] }>(listKeys.lists());
      const cachedList = listsData?.data?.find((item) => item.id === params.id);
      if (cachedList) {
        return {
          ...cachedList,
          people: [],
        };
      }
      return null;
    },
    staleTime: 30 * 1000,
    refetchOnMount: true,
    enabled: !!client && !clientLoading,
  });
};

export const useListLists = (params?: Schemas.Types.Pagination) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<ListQueryResponse, Error>({
    queryKey: listKeys.list(params),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.list.$get({
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      return await res.json();
    },
    enabled: !!client && !clientLoading,
  });
};

export const useListListsByStatus = (
  params: ListSchemas.Types.ListByStatus & Schemas.Types.Pagination
) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<ListQueryResponse, Error>({
    queryKey: listKeys.list({ status: params.status, cursor: params.cursor }),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.list.status[':status'].$get({
        param: { status: params.status },
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      return await res.json();
    },
    enabled: !!client && !clientLoading,
  });
};
