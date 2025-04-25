import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/api';
import { assignmentKeys } from './keys';
import { AssignmentItem } from '@core/charts/assignment';

export const useListChartAssignments = (chartId: string, furnitureId: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: AssignmentItem[] }, Error>({
    queryKey: assignmentKeys.lists(chartId),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].assignments.$get({
        param: { id: chartId, furnitureId },
        query: {},
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId,
  });
};

export const useGetAssignment = (chartId: string, id: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<AssignmentItem | null, Error>({
    queryKey: assignmentKeys.details(chartId, id),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.chart[':id'].assignments[':assignmentId'].$get({
        param: { id: chartId, assignmentId: id },
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!chartId && !!id,
  });
};

export const useListAssignmentsByPerson = (personId: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: AssignmentItem[] }, Error>({
    queryKey: assignmentKeys.byPerson(personId),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person[':id'].assignments.$get({
        param: { id: personId },
        query: {}, // Add empty query object
      });
      return res.json();
    },
    enabled: !!client && !clientLoading && !!personId,
  });
};

export const useListAssignmentsByFurniture = (furnitureId: string) => {
  const { client, isLoading: clientLoading } = useApiClient();

  return useQuery<{ data: AssignmentItem[] }, Error>({
    queryKey: assignmentKeys.byFurniture(furnitureId),
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      // Currently we don't have a route for getting assignments by furniture,
      // so we'll need to add more API routes or filter client-side
      throw new Error('Not implemented: furniture assignments endpoint');
    },
    enabled: !!client && !clientLoading && !!furnitureId,
  });
};
