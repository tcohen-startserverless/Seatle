import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { client } from '@school/frontend/api';
import { schoolKeys } from './keys';
import type { SchoolItem } from '@core/school';
import type { ListApiResponse } from '@school/frontend/hooks/types';

export const useSchools = () => {
  return useInfiniteQuery<ListApiResponse<SchoolItem>>({
    queryKey: schoolKeys.lists(),
    queryFn: async ({ pageParam }) => {
      const response = await client.school.$get({
        query: { cursor: pageParam },
      });
      const data = await response.json();
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useSchool = (schoolId: string) => {
  return useQuery<SchoolItem>({
    queryKey: schoolKeys.detail(schoolId),
    queryFn: async () => {
      const response = await client.school[':schoolId'].$get({
        param: { schoolId },
      });

      if (!response.ok) {
        throw new Error(`School not found: ${schoolId}`);
      }

      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
