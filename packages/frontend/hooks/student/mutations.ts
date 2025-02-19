import { StudentItem, StudentSchemas } from '@core/student';
import { useMutation, useQueryClient } from 'react-query';
import { client } from '@school/frontend/api';
import { studentKeys } from './keys';

export const useCreateStudent = (schoolId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newStudent: StudentSchemas.Types.CreateInput) =>
      client.student.$post({
        json: { ...newStudent, schoolId },
      }),
    {
      onMutate: async (newStudent) => {
        await queryClient.cancelQueries(studentKeys.list(schoolId));
        const previousStudents = queryClient.getQueryData(studentKeys.list(schoolId));
        queryClient.setQueryData(studentKeys.list(schoolId), (old: any) => {
          const newData = {
            ...old?.pages[0],
            data: [
              { ...newStudent, id: 'temp-' + Date.now() },
              ...(old?.pages[0]?.data || []),
            ],
          };
          return { pages: [newData], pageParams: old?.pageParams };
        });
        return { previousStudents };
      },
      onError: (_err, _newStudent, context: any) => {
        queryClient.setQueryData(studentKeys.list(schoolId), context.previousStudents);
      },
      onSettled: () => {
        queryClient.invalidateQueries(studentKeys.list(schoolId));
      },
      retry: 3,
    }
  );
};

export const useUpdateStudent = (schoolId: string, id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updatedStudent: StudentSchemas.Types.PatchInput) =>
      client.student[':schoolId'][':id'].$put({
        param: { id, schoolId },
        json: { ...updatedStudent },
      }),
    {
      onMutate: async (updatedStudent) => {
        await queryClient.cancelQueries(studentKeys.detail(schoolId, id));
        const previousStudent = queryClient.getQueryData<StudentItem>(
          studentKeys.detail(schoolId, id)
        );
        queryClient.setQueryData(studentKeys.detail(schoolId, id), {
          ...previousStudent,
          ...updatedStudent,
        });
        return { previousStudent };
      },
      onError: (_err, _variables, context: any) => {
        queryClient.setQueryData(
          studentKeys.detail(schoolId, id),
          context.previousStudent
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(studentKeys.detail(schoolId, id));
        queryClient.invalidateQueries(studentKeys.list(schoolId));
      },
      retry: 2,
    }
  );
};

export const useDeleteStudent = (schoolId: string, id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      client.student[':schoolId'][':id'].$delete({
        param: { schoolId, id },
      }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(studentKeys.list(schoolId));
        const previousStudents = queryClient.getQueryData(studentKeys.list(schoolId));
        queryClient.setQueryData(studentKeys.list(schoolId), (old: any) => ({
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((student: any) => student.id !== id),
          })),
        }));
        return { previousStudents };
      },
      onError: (_err, _variables, context: any) => {
        queryClient.setQueryData(studentKeys.list(schoolId), context.previousStudents);
      },
      onSettled: () => {
        queryClient.invalidateQueries(studentKeys.list(schoolId));
      },
      retry: 3,
    }
  );
};
