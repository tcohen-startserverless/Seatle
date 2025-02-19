import { useInfiniteQuery, useQuery } from 'react-query';
import { client } from '@school/frontend/api';
import { studentKeys } from './keys';
import type { StudentItem } from '@core/student';
import type { ListApiResponse } from '@school/frontend/hooks/types';

export const useStudents = (schoolId: string) => {
  return useInfiniteQuery<ListApiResponse<StudentItem>>(
    studentKeys.list(schoolId),
    async ({ pageParam }) => {
      const response = await client.student.$get({
        query: {
          schoolId,
          cursor: pageParam,
        },
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

export const useStudent = (schoolId: string, id: string) => {
  return useQuery<StudentItem>(
    studentKeys.detail(schoolId, id),
    async () => {
      const response = await client.student[':schoolId'][':id'].$get({
        param: { schoolId, id },
      });

      if (!response.ok) {
        throw new Error(`Student not found: ${id}`);
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
