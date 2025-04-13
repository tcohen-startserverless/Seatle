import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { chartKeys } from './keys';
import { Schemas } from '@core/schema';
import { ChartSchemas } from '@core/charts/chart';
import type { ChartItem, CompleteChart } from '@core/charts/chart';

export const useGetChart = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  const queryClient = useQueryClient();

  return useQuery<CompleteChart | null, Error>({
    queryKey: chartKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].$get({
        param: params,
      });
      return res.json();
    },
    placeholderData: () => {
      const chartsData = queryClient.getQueryData<{ data: ChartItem[] }>(chartKeys.charts());
      const cachedChart = chartsData?.data?.find((item) => item.id === params.id);
      if (cachedChart) {
        return {
          ...cachedChart,
          items: [],
          assignments: [],
          lists: [],
        };
      }
      return null;
    },
    staleTime: 30 * 1000,
    refetchOnMount: true,
    enabled: !!client && !clientLoading,
  });
};

export const useListCharts = (params?: Schemas.Types.Pagination) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: ChartItem[]; cursor?: string }, Error>({
    queryKey: chartKeys.list(params),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart.$get({
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      const result = await res.json();
      return {
        data: result.data,
        cursor: result.cursor || undefined,
      };
    },
    enabled: !!client && !clientLoading,
  });
};

export const useListChartsByStatus = (
  params: ChartSchemas.Types.ListByStatusInput & Schemas.Types.Pagination
) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: ChartItem[]; cursor?: string }, Error>({
    queryKey: chartKeys.list({ status: params.status, cursor: params.cursor }),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart.status[':status'].$get({
        param: { status: params.status },
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      const result = await res.json();
      return {
        data: result.data,
        cursor: result.cursor || undefined,
      };
    },
    enabled: !!client && !clientLoading,
  });
};