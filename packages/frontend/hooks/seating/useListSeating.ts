import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useListSeating({
  schoolId,
  classId,
}: {
  schoolId: string;
  classId: string;
}) {
  return useQuery({
    queryKey: ['seating', schoolId, classId],
    queryFn: async () => {
      const response = await api.get('/seating', {
        params: { schoolId, classId },
      });
      return response.json();
    },
  });
}