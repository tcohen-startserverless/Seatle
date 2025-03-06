import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
    queryKey: ['seating', schoolId, classId, seatingId],
    queryFn: async () => {
      const response = await api.get(`/seating/${seatingId}`, {
        params: { schoolId, classId },
      });
      return response.json();
    },
    enabled,
  });
}