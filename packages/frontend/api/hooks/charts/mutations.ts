import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { chartKeys } from './keys';
import { ChartSchemas } from '@core/charts/chart';
import type { ChartItem } from '@core/charts/chart';
import { Schemas } from '@core/schema';

export const useCreateChart = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<ChartItem, Error, ChartSchemas.Types.CreateInput>({  
    mutationFn: async (params) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart.$post({
        json: params,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: chartKeys.byChart(data.userId, data.id),
      });
    },
  });
};

export const useUpdateChart = () => {
  const queryClient = useQueryClient();
  type UpdateParams = Schemas.Types.Params & ChartSchemas.Types.PatchInput;
  const { client } = useApiClient();

  return useMutation<ChartItem, Error, UpdateParams, { previousChart?: ChartItem | null }>({    
    mutationFn: async ({ id, ...params }: UpdateParams) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].$patch({
        param: { id },
        json: params,
      });
      return res.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: chartKeys.detail(newData.id) });
      const previousChart = queryClient.getQueryData<ChartItem | null>(
        chartKeys.detail(newData.id)
      );

      if (previousChart) {
        queryClient.setQueryData(chartKeys.detail(newData.id), {
          ...previousChart,
          ...newData,
        });
      }

      return { previousChart };
    },
    onError: (_, variables, context) => {
      if (context?.previousChart) {
        queryClient.setQueryData(chartKeys.detail(variables.id), context.previousChart);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chartKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: chartKeys.charts() });
    },
  });
};

export const useDeleteChart = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();
  type DeleteParams = Schemas.Types.Params;

  return useMutation<
    { userId: string; id: string } | null,
    Error,
    DeleteParams,
    { previousChart?: ChartItem | null }
  >({
    mutationFn: async ({ id }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].$delete({
        param: { id },
      });
      return res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: chartKeys.detail(id) });
      const previousChart = queryClient.getQueryData<ChartItem | null>(chartKeys.detail(id));

      queryClient.setQueryData(chartKeys.detail(id), undefined);

      queryClient.setQueryData<{ data: ChartItem[]; cursor?: string } | undefined>(
        chartKeys.charts(),
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((chart) => chart.id !== id),
              }
            : undefined
      );

      return { previousChart };
    },
    onError: (_, variables, context) => {
      if (context?.previousChart) {
        queryClient.setQueryData(chartKeys.detail(variables.id), context.previousChart);
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: chartKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: chartKeys.charts() });
    },
  });
};