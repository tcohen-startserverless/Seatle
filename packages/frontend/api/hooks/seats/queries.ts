import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { seatKeys } from './keys';
import { SeatItem } from '@core/charts/seat';

export const useListChartSeats = (chartId: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: SeatItem[] }, Error>({
    queryKey: seatKeys.lists(chartId),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':chartId'].seats.$get({
        param: { chartId },
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId,
  });
};

export const useGetSeat = (chartId: string, id: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<SeatItem | null, Error>({
    queryKey: seatKeys.details(chartId, id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':chartId'].seats[':id'].$get({
        param: { chartId, id },
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId && !!id,
  });
};
