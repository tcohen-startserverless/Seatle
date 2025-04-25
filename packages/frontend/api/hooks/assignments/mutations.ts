import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { assignmentKeys } from './keys';
import { AssignmentSchemas } from '@core/charts/assignment';
import type { AssignmentItem } from '@core/charts/assignment';

export const useCreateAssignment = (chartId: string) => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<AssignmentItem, Error, AssignmentSchemas.Types.Create>({
    mutationFn: async (params) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].assignments.$post({
        param: { id: chartId },
        json: params,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists(chartId) });
      queryClient.invalidateQueries({ queryKey: ['charts', 'detail', chartId] });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.byPerson(data.personId) });
      if (data.personId && data.furnitureId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.byFurniture(data.furnitureId),
        });
      }
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<
    Partial<AssignmentItem>,
    Error,
    { chartId: string; id: string; data: AssignmentSchemas.Types.Patch }
  >({
    mutationFn: async ({ chartId, id, data }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].assignments[':assignmentId'].$patch({
        param: { id: chartId, assignmentId: id },
        json: data,
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.details(variables.chartId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.lists(variables.chartId),
      });
      queryClient.invalidateQueries({
        queryKey: ['charts', 'detail', variables.chartId],
      });
      if (data.personId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.byPerson(data.personId),
        });
      }
      if (data.furnitureId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.byFurniture(data.furnitureId),
        });
      }
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<AssignmentItem | null, Error, { chartId: string; id: string }>({
    mutationFn: async ({ chartId, id }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].assignments[':assignmentId'].$delete({
        param: { id: chartId, assignmentId: id },
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.lists(variables.chartId),
      });
      queryClient.invalidateQueries({
        queryKey: ['charts', 'detail', variables.chartId],
      });
      if (data?.personId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.byPerson(data.personId),
        });
      }
      if (data?.furnitureId) {
        queryClient.invalidateQueries({
          queryKey: assignmentKeys.byFurniture(data.furnitureId),
        });
      }
    },
  });
};
