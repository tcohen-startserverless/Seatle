import { SchoolItem, SchoolSchemas } from '@core/school';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '@school/frontend/api';
import { schoolKeys } from './keys';

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newSchool: SchoolSchemas.Types.CreateSchoolInput) =>
      client.school.$post({ json: newSchool }),
    {
      onMutate: async (newSchool) => {
        await queryClient.cancelQueries(schoolKeys.lists());
        const previousSchools = queryClient.getQueryData(schoolKeys.lists());
        queryClient.setQueryData(schoolKeys.lists(), (old: any) => {
          const newData = {
            ...old?.pages[0],
            data: [
              { ...newSchool, schoolId: 'temp-' + Date.now() },
              ...(old?.pages[0]?.data || []),
            ],
          };
          return { pages: [newData], pageParams: old?.pageParams };
        });
        return { previousSchools };
      },
      onError: (err, newSchool, context: any) => {
        queryClient.setQueryData(schoolKeys.lists(), context.previousSchools);
      },
      onSettled: () => {
        queryClient.invalidateQueries(schoolKeys.lists());
      },
      retry: 3,
    }
  );
};

export const useUpdateSchool = (schoolId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updatedSchool: SchoolSchemas.Types.PatchSchoolInput) =>
      client.school[':schoolId'].$put({
        param: {
          schoolId: schoolId,
        },
        json: updatedSchool,
      }),
    {
      onMutate: async (updatedSchool) => {
        await queryClient.cancelQueries(schoolKeys.detail(schoolId));
        const previousSchool = queryClient.getQueryData<SchoolItem>(
          schoolKeys.detail(schoolId)
        );
        queryClient.setQueryData(schoolKeys.detail(schoolId), {
          ...previousSchool,
          ...updatedSchool,
        });
        return { previousSchool };
      },
      onError: (err, variables, context: any) => {
        queryClient.setQueryData(
          schoolKeys.detail(schoolId),
          context.previousSchool
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(schoolKeys.detail(schoolId));
        queryClient.invalidateQueries(schoolKeys.lists());
      },
      retry: 2,
    }
  );
};

export const useDeleteSchool = (schoolId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      client.school[':schoolId'].$delete({
        param: {
          schoolId,
        },
      }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(schoolKeys.lists());
        const previousSchools = queryClient.getQueryData(schoolKeys.lists());
        queryClient.setQueryData(schoolKeys.lists(), (old: any) => ({
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter(
              (school: any) => school.schoolId !== schoolId
            ),
          })),
        }));
        return { previousSchools };
      },
      onError: (err, variables, context: any) => {
        queryClient.setQueryData(schoolKeys.lists(), context.previousSchools);
      },
      onSettled: () => {
        queryClient.invalidateQueries(schoolKeys.lists());
      },
      retry: 3,
    }
  );
};
