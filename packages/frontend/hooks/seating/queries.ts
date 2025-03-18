import { useQuery } from '@tanstack/react-query';
import { client } from '@school/frontend/api';
import { seatingKeys } from './keys';

export function useListSeating({
  schoolId,
  classId,
}: {
  schoolId: string;
  classId: string;
}) {
  return useQuery({
    queryKey: seatingKeys.list(schoolId, classId),
    queryFn: async () => {
      const response = await client.seating.$get({
        query: { schoolId, classId },
      });
      return await response.json();
    },
  });
}

export function useGetSeating({
  schoolId,
  classId,
  seatingId,
  enabled = true,
}: {
  schoolId: string;
  classId: string;
  seatingId: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: seatingKeys.detail(schoolId, classId, seatingId),
    queryFn: async () => {
      const response = await client.seating[':seatingId'].$get({
        param: { seatingId },
        query: { schoolId, classId },
      });
      
      if (!response.ok) {
        throw new Error(`Seating not found: ${seatingId}`);
      }
      
      return await response.json();
    },
    enabled,
  });
}