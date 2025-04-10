import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/api';
import { listKeys } from './keys';
import { ListSchemas } from '@core/list';
import type { ListItem } from '@core/list';
import { Schemas } from '@core/schema';

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation<ListItem, Error, Omit<ListSchemas.Types.Create, 'userId'>>({
    mutationFn: async (params) => {
      const res = await client.list.$post({
        json: params,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: listKeys.byList(data.userId, data.id),
      });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  type UpdateParams = Schemas.Types.Params & ListSchemas.Types.Patch;

  return useMutation<ListItem, Error, UpdateParams, { previousList?: ListItem | null }>({
    mutationFn: async ({ id, ...params }: UpdateParams) => {
      const res = await client.list[':id'].$patch({
        param: { id },
        json: params,
      });
      return res.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: listKeys.detail(newData.id) });
      const previousList = queryClient.getQueryData<ListItem | null>(
        listKeys.detail(newData.id)
      );

      if (previousList) {
        queryClient.setQueryData(listKeys.detail(newData.id), {
          ...previousList,
          ...newData,
        });
      }

      return { previousList };
    },
    onError: (_, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(variables.id), context.previousList);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: listKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: listKeys.lists() });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  type DeleteParams = Schemas.Types.Params;

  return useMutation<
    { userId: string; id: string } | null,
    Error,
    DeleteParams,
    { previousList?: ListItem | null }
  >({
    mutationFn: async ({ id }) => {
      const res = await client.list[':id'].$delete({
        param: { id },
      });
      return res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: listKeys.detail(id) });
      const previousList = queryClient.getQueryData<ListItem | null>(listKeys.detail(id));

      queryClient.setQueryData(listKeys.detail(id), undefined);

      queryClient.setQueryData<{ data: ListItem[]; cursor?: string } | undefined>(
        listKeys.lists(),
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((list) => list.id !== id),
              }
            : undefined
      );

      return { previousList };
    },
    onError: (_, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(variables.id), context.previousList);
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: listKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: listKeys.lists() });
    },
  });
};
