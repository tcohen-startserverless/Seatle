import { useQuery } from '@tanstack/react-query';
import { client } from '@school/frontend/api';
import { ClassKeys } from './keys';
import type { ClassItem } from '@core/class';
import type { ListApiResponse } from '@school/frontend/hooks/types';

export function useClasses(schoolId: string) {
  return useQuery({
    queryKey: ClassKeys.list(schoolId),
    queryFn: async () => {
      const response = await client.school[':schoolId'].class.$get({
        param: { schoolId }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch classes for school: ${schoolId}`);
      }
      
      const data = await response.json() as ListApiResponse<ClassItem>;
      return data;
    }
  });
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: ClassKeys.detail(classId),
    queryFn: async () => {
      const response = await client.class[':classId'].$get({
        param: { classId }
      });
      
      if (!response.ok) {
        throw new Error(`Class not found: ${classId}`);
      }
      
      const data = await response.json();
      return data;
    }
  });
}