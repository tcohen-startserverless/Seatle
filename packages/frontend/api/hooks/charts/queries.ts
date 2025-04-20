import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { chartKeys } from './keys';
import { Schemas } from '@core/schema';
import { ChartSchemas } from '@core/charts/chart';
import {
  ChartsResponse,
  ChartQueryResponse,
  TransformedChartResponse,
} from '@core/charts';

export const useGetChart = (params: Schemas.Types.Params) => {
  const { client, isLoading: clientLoading } = useApiClient();
  const queryClient = useQueryClient();

  return useQuery<TransformedChartResponse | null, Error>({
    queryKey: chartKeys.detail(params.id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].$get({
        param: params,
      });
      return await res.json();
    },
    placeholderData: () => {
      const chartsData = queryClient.getQueryData<ChartsResponse>(chartKeys.charts());
      const cachedChart = chartsData?.data?.Chart?.find(
        (item) => item.chartId === params.id
      );
      if (!cachedChart) return null;
      return {
        ...cachedChart,
        id: cachedChart.chartId,
        seats: [],
        seating: [],
      };
    },
    staleTime: 30 * 1000,
    refetchOnMount: true,
    enabled: !!client && !clientLoading,
  });
};

export const useListCharts = (params?: Schemas.Types.Pagination) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<ChartQueryResponse, Error>({
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
      return result;
    },
    enabled: !!client && !clientLoading,
  });
};

export const useListChartsByStatus = (
  params: ChartSchemas.Types.ListByStatus & Schemas.Types.Pagination
) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<ChartQueryResponse, Error>({
    queryKey: chartKeys.list({
      status: params.status,
      cursor: params.cursor,
    }),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart.status[':status'].$get({
        param: { status: params.status },
        query: {
          cursor: params?.cursor,
          limit: params?.limit?.toString(),
        },
      });
      return await res.json();
    },
    enabled: !!client && !clientLoading,
  });
};
