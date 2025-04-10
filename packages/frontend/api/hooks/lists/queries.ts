import { useQuery } from '@tanstack/react-query';
import { client } from '@/api';
import { listKeys } from './keys';
import { Schemas } from '@core/schema';
import { ListSchemas } from '@core/list';
import type { ListItem } from '@core/list';

export const useGetList = (params: Schemas.Types.Params) => {
  return useQuery<ListItem | null, Error>({
    queryKey: listKeys.detail(params.id),
    queryFn: async () => {
      const res = await client.list[':id'].$get({
        param: params,
      });
      return res.json();
    },
  });
};

export const useListLists = (params?: Schemas.Types.Pagination) => {
  return useQuery<{ data: ListItem[]; cursor?: string }, Error>({
    queryKey: listKeys.list(params),
    queryFn: async () => {
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
  });
};

export const useListListsByStatus = (
  params: ListSchemas.Types.ListByStatus & Schemas.Types.Pagination
) => {
  return useQuery<{ data: ListItem[]; cursor?: string }, Error>({
    queryKey: listKeys.list({ status: params.status, cursor: params.cursor }),
    queryFn: async () => {
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
  });
};
