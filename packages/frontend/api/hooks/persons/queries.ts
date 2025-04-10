import { useQuery } from '@tanstack/react-query';
import { client } from '@/api';
import { personKeys } from './keys';
import { Schemas } from '@core/schema';
import type { PersonItem } from '@core/person';

export const useGetPerson = (params: Schemas.Types.Params) => {
  return useQuery<PersonItem | null, Error>({
    queryKey: personKeys.detail(params.id),
    queryFn: async () => {
      const res = await client.person[':id'].$get({
        param: params,
      });
      return res.json();
    },
  });
};

export const useListPersons = (params?: Schemas.Types.Pagination) => {
  return useQuery<{ data: PersonItem[]; cursor?: string }, Error>({
    queryKey: personKeys.list(params),
    queryFn: async () => {
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
  });
};
