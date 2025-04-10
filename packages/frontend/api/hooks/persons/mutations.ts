import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/api';
import { personKeys } from './keys';
import { PersonSchema } from '@core/person';
import type { PersonItem } from '@core/person';
import { Schemas } from '@core/schema';

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation<PersonItem, Error, Omit<PersonSchema.Types.Create, 'userId'>>({
    mutationFn: async (params) => {
      const res = await client.person.$post({
        json: params,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: personKeys.byPerson(data.userId, data.id),
      });
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();
  type UpdateParams = Schemas.Types.Params & PersonSchema.Types.Patch;

  return useMutation<PersonItem, Error, UpdateParams, { previousPerson?: PersonItem | null }>({
    mutationFn: async ({ id, ...params }: UpdateParams) => {
      const res = await client.person[':id'].$put({
        param: { id },
        json: params,
      });
      return res.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: personKeys.detail(newData.id) });
      const previousPerson = queryClient.getQueryData<PersonItem | null>(
        personKeys.detail(newData.id)
      );

      if (previousPerson) {
        queryClient.setQueryData(personKeys.detail(newData.id), {
          ...previousPerson,
          ...newData,
        });
      }

      return { previousPerson };
    },
    onError: (_, variables, context) => {
      if (context?.previousPerson) {
        queryClient.setQueryData(personKeys.detail(variables.id), context.previousPerson);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: personKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: personKeys.persons() });
    },
  });
};

export const useDeletePerson = () => {
  const queryClient = useQueryClient();
  type DeleteParams = Schemas.Types.Params;

  return useMutation<
    { userId: string; id: string } | null,
    Error,
    DeleteParams,
    { previousPerson?: PersonItem | null }
  >({
    mutationFn: async ({ id }) => {
      const res = await client.person[':id'].$delete({
        param: { id },
      });
      return res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: personKeys.detail(id) });
      const previousPerson = queryClient.getQueryData<PersonItem | null>(personKeys.detail(id));

      queryClient.setQueryData(personKeys.detail(id), undefined);

      queryClient.setQueryData<{ data: PersonItem[]; cursor?: string } | undefined>(
        personKeys.persons(),
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((person) => person.id !== id),
              }
            : undefined
      );

      return { previousPerson };
    },
    onError: (_, variables, context) => {
      if (context?.previousPerson) {
        queryClient.setQueryData(personKeys.detail(variables.id), context.previousPerson);
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: personKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: personKeys.persons() });
    },
  });
};
