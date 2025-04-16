import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { seatKeys } from './keys';
import { SeatSchemas } from '@core/charts/seat';
import { Schemas } from '@core/schema';
import type { SeatItem } from '@core/charts/seat';

export const useCreateSeat = (chartId: string) => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<SeatItem, Error, SeatSchemas.Types.Create>({
    mutationFn: async (params) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':chartId'].seats.$post({
        param: { chartId },
        json: params,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seatKeys.lists(chartId) });
    },
  });
};

export const useUpdateSeat = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();
  type UpdateParams = Schemas.Types.Params & SeatSchemas.Types.Patch;

  return useMutation<
    UpdateParams,
    Error,
    { chartId: string; id: string; data: SeatSchemas.Types.Patch }
  >({
    mutationFn: async ({ chartId, id, data }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':chartId'].seats[':id'].$patch({
        param: { chartId, id },
        json: data,
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seatKeys.details(variables.chartId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: seatKeys.lists(variables.chartId),
      });
    },
  });
};

export const useDeleteSeat = () => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<
    SeatItem | null, 
    Error, 
    { chartId: string; id: string }
  >({
    mutationFn: async ({ chartId, id }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':chartId'].seats[':id'].$delete({
        param: { chartId, id },
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: seatKeys.lists(variables.chartId),
      });
    },
  });
};

export const useBulkCreateSeats = (chartId: string) => {
  const queryClient = useQueryClient();
  const { client } = useApiClient();

  return useMutation<SeatItem[], Error, SeatSchemas.Types.Create[]>({
    mutationFn: async (seats) => {
      if (!client) throw new Error('API client not initialized');
      const results = await Promise.all(
        seats.map(async (seat) => {
          const res = await client.chart[':chartId'].seats.$post({
            param: { chartId },
            json: {
              ...seat,
              chartId,
            },
          });
          return res.json();
        })
      );
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seatKeys.lists(chartId) });
    },
  });
};
