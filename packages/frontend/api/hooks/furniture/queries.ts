import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { furnitureKeys } from './keys';
import { FurnitureItem } from '@core/charts/furniture';

export const useListChartFurniture = (chartId: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: FurnitureItem[] }, Error>({
    queryKey: furnitureKeys.lists(chartId),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].furniture.$get({
        param: { id: chartId },
        query: {},
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId,
  });
};

export const useGetFurniture = (chartId: string, id: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<FurnitureItem | null, Error>({
    queryKey: furnitureKeys.details(chartId, id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].furniture[':furnitureId'].$get({
        param: { id: chartId, furnitureId: id },
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId && !!id,
  });
};
