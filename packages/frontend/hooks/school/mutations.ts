import { SchoolItem, SchoolSchemas } from '@core/school';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@school/frontend/api';
import { schoolKeys } from './keys';

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSchool: SchoolSchemas.Types.CreateSchoolInput) => {
      const response = await client.school.$post({ json: newSchool });
      return await response.json();
    },
    onMutate: async (newSchool) => {
      await queryClient.cancelQueries({ queryKey: schoolKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
    },
    retry: 3,
  });
};

export const useUpdateSchool = (schoolId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedSchool: SchoolSchemas.Types.PatchSchoolInput) => {
      const response = await client.school[':schoolId'].$put({
        param: {
          schoolId: schoolId,
        },
        json: updatedSchool,
      });
      return await response.json();
    },
    onMutate: async (updatedSchool) => {
      await queryClient.cancelQueries({ queryKey: schoolKeys.detail(schoolId) });
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
      queryClient.invalidateQueries({ queryKey: schoolKeys.detail(schoolId) });
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
    },
    retry: 2,
  });
};

export const useDeleteSchool = (schoolId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await client.school[':schoolId'].$delete({
        param: {
          schoolId,
        },
      });
      return response.ok;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: schoolKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
    },
    retry: 3,
  });
};
