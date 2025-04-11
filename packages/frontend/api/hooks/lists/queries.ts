import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { listKeys } from './keys';
import { Schemas } from '@core/schema';
import { ListSchemas } from '@core/list';
import type { ListItem } from '@core/list';

export const useGetList = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  const queryClient = useQueryClient();
  
  return useQuery<ListItem | null, Error>({
    queryKey: listKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.list[':id'].$get({
        param: params,
      });
      return res.json();
    },
    initialData: () => {
      const listsData = queryClient.getQueryData<{ data: ListItem[] }>(listKeys.lists());
      const cachedList = listsData?.data?.find(item => item.id === params.id);
      return cachedList || null;
    },
    enabled: !!client && !clientLoading,
  });
};

export const useListLists = (params?: Schemas.Types.Pagination) => {
  const { client, isLoading: clientLoading } = useApiClient();
  
  return useQuery<{ data: ListItem[]; cursor?: string }, Error>({
    queryKey: listKeys.list(params),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.list.$get({
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

export const useListListsByStatus = (
  params: ListSchemas.Types.ListByStatus & Schemas.Types.Pagination
) => {
  const { client, isLoading: clientLoading } = useApiClient();
  
  return useQuery<{ data: ListItem[]; cursor?: string }, Error>({
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
      const result = await res.json();
      return {
        data: result.data,
        cursor: result.cursor || undefined,
      };
    },
    enabled: !!client && !clientLoading,
  });
};
