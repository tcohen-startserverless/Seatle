import { useInfiniteQuery, useQuery } from 'react-query';
import { client } from '@school/frontend/api';
import { schoolKeys } from './keys';
import type { SchoolItem } from '@core/school';
import type { ListApiResponse } from '@school/frontend/hooks/types';

export const useSchools = () => {
  return useInfiniteQuery<ListApiResponse<SchoolItem>>(
    schoolKeys.lists(),
    async ({ pageParam }) => {
      const response = await client.school.$get({
        query: { cursor: pageParam },
      });
      const data = await response.json();
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor || null,
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const useSchool = (schoolId: string) => {
  return useQuery<SchoolItem>(
    schoolKeys.detail(schoolId),
    async () => {
      const response = await client.school[':schoolId'].$get({
        param: { schoolId },
      });

      if (!response.ok) {
        throw new Error(`School not found: ${schoolId}`);
      }

      const data = await response.json();
      return data;
    },
    {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};
