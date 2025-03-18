import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassSchemas } from '@core/class';
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

export function useUpdateClass(schoolId: string, classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ClassSchemas.Types.UpdateInput) => {
      const response = await client.school[':schoolId'].class[':classId'].$put({
        param: { schoolId, classId },
        json: input,
      });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClassKeys.detail(classId) });
      queryClient.invalidateQueries({ queryKey: ClassKeys.list(schoolId) });
    },
  });
}

export function useDeleteClass(schoolId: string, classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.school[':schoolId'].class[':classId'].$delete({
        param: { schoolId, classId },
      });
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClassKeys.list(schoolId) });
    },
  });
}
