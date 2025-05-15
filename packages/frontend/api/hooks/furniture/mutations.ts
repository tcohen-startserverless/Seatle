import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { useApiClient } from '@/api';
import { furnitureKeys } from './keys';
import { FurnitureSchemas } from '@core/charts/furniture';
import { Schemas } from '@core/schema';
import type { FurnitureItem } from '@core/charts/furniture';

export const useCreateFurniture = (chartId: string) => {
  const { client } = useApiClient();

  return useMutation<FurnitureItem, Error, FurnitureSchemas.Types.Create>({
    mutationFn: async (params) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].furniture.$post({
        param: { id: chartId },
        json: params,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: furnitureKeys.lists(chartId) });
      queryClient.invalidateQueries({ queryKey: ['charts', 'detail', chartId] });
    },
  });
};

export const useUpdateFurniture = () => {
  const { client } = useApiClient();
  type UpdateParams = Schemas.Types.Params & FurnitureSchemas.Types.Patch;

  return useMutation<
    UpdateParams,
    Error,
    { chartId: string; id: string; data: FurnitureSchemas.Types.Patch }
  >({
    mutationFn: async ({ chartId, id, data }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].furniture[':furnitureId'].$patch({
        param: { id: chartId, furnitureId: id },
        json: data,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: furnitureKeys.details(variables.chartId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: furnitureKeys.lists(variables.chartId),
      });
      queryClient.invalidateQueries({
        queryKey: ['charts', 'detail', variables.chartId],
      });
    },
  });
};

export const useDeleteFurniture = () => {
  const { client } = useApiClient();

  return useMutation<FurnitureItem | null, Error, { chartId: string; id: string }>({
    mutationFn: async ({ chartId, id }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].furniture[':furnitureId'].$delete({
        param: { id: chartId, furnitureId: id },
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: furnitureKeys.lists(variables.chartId),
      });
      queryClient.invalidateQueries({
        queryKey: ['charts', 'detail', variables.chartId],
      });
    },
  });
};

export const useBulkCreateFurniture = (chartId: string) => {
  const { client } = useApiClient();

  return useMutation<FurnitureItem[], Error, FurnitureSchemas.Types.Create[]>({
    mutationFn: async (furniture) => {
      if (!client) throw new Error('API client not initialized');

      // Create furniture items one by one for better error handling
      const results = [];
      for (const item of furniture) {
        try {
          const res = await client.chart[':id'].furniture.$post({
            param: { id: chartId },
            json: {
              ...item,
              chartId, // Ensure chartId is set correctly
            },
          });

          const result = await res.json();
          results.push(result);
        } catch (error) {
          console.error('Error creating furniture:', error, item);
          throw error; // Rethrow to ensure mutation fails properly
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: furnitureKeys.lists(chartId) });
      queryClient.invalidateQueries({ queryKey: ['charts', 'detail', chartId] });
    },
  });
};
