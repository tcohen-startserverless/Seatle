import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassService, ClassSchemas } from '@core/class';
import { client } from '@school/frontend/api';
import { ClassKeys } from './keys';

export function useCreateClass(schoolId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ClassSchemas.Types.CreateInput) => {
      const response = await client.school[':schoolId'].class.$post({
        param: { schoolId },
        json: input,
      });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClassKeys.list(schoolId) });
    },
  });
}
