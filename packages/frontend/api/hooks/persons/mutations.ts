import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { useApiClient } from '@/api';
import { personKeys } from './keys';
import { listKeys } from '../lists/keys';
import { PersonSchema } from '@core/person';
import type { PersonItem, PersonQueryResponse } from '@core/person';
import { Schemas } from '@core/schema';

export const useCreatePerson = () => {
  const { client } = useApiClient();

  return useMutation<PersonItem, Error, PersonSchema.Types.Create>({
    mutationFn: async (params) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person.$post({
        json: params,
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: personKeys.byPerson(data.userId, data.id),
      });

      if (variables.listId) {
        const listId = variables.listId;
        queryClient.setQueryData(listKeys.detail(listId), (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            people: [...(oldData.people || []), data],
          };
        });
      }
    },
  });
};

export const useUpdatePerson = () => {
  const { client } = useApiClient();
  type UpdateParams = Schemas.Types.Params &
    PersonSchema.Types.Patch & {
      previousListId?: string;
    };

  return useMutation<
    PersonItem,
    Error,
    UpdateParams,
    { previousPerson?: PersonItem | null }
  >({
    mutationFn: async ({ id, ...params }: UpdateParams) => {
      if (!client) throw new Error('API client not initialized');
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: personKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: personKeys.persons() });

      if (variables.listId) {
        if (variables.previousListId && variables.previousListId !== variables.listId) {
          queryClient.setQueryData(
            listKeys.detail(variables.previousListId),
            (oldData: any) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                people: oldData.people.filter((p: PersonItem) => p.id !== data.id),
              };
            }
          );

          queryClient.setQueryData(listKeys.detail(variables.listId), (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              people: [...(oldData.people || []), data],
            };
          });
        } else {
          queryClient.setQueryData(listKeys.detail(variables.listId), (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              people: oldData.people.map((p: PersonItem) =>
                p.id === data.id ? data : p
              ),
            };
          });
        }
      }
    },
  });
};

export const useDeletePerson = () => {
  const { client } = useApiClient();
  type DeleteParams = Schemas.Types.Params & { listId?: string };

  return useMutation<
    { userId: string; id: string } | null,
    Error,
    DeleteParams,
    { previousPerson?: PersonItem | null; listId?: string }
  >({
    mutationFn: async ({ id }) => {
      if (!client) throw new Error('API client not initialized');
      const res = await client.person[':id'].$delete({
        param: { id },
      });
      return res.json();
    },
    onMutate: async ({ id, listId }) => {
      await queryClient.cancelQueries({ queryKey: personKeys.detail(id) });
      if (listId) {
        await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });
      }

      const previousPerson = queryClient.getQueryData<PersonItem | null>(
        personKeys.detail(id)
      );

      const effectiveListId = listId || previousPerson?.listId;

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

      if (effectiveListId) {
        queryClient.setQueryData(listKeys.detail(effectiveListId), (oldData: any) => {
          if (!oldData || !oldData.people) return oldData;
          return {
            ...oldData,
            people: oldData.people.filter((p: PersonItem) => p.id !== id),
          };
        });
      }

      return { previousPerson, listId: effectiveListId };
    },
    onError: (_, variables, context) => {
      if (context?.previousPerson) {
        queryClient.setQueryData(personKeys.detail(variables.id), context.previousPerson);
      }

      if (context?.listId) {
        queryClient.invalidateQueries({ queryKey: listKeys.detail(context.listId) });
      }
    },
    onSuccess: (data, variables, context) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: personKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: personKeys.persons() });

      const effectiveListId =
        variables.listId || context?.listId || context?.previousPerson?.listId;
      if (effectiveListId) {
        queryClient.invalidateQueries({
          queryKey: listKeys.detail(effectiveListId),
          refetchType: 'none',
        });
      }
    },
  });
};
