export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (schoolId: string) => [...studentKeys.lists(), schoolId] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (schoolId: string, studentId: string) =>
    [...studentKeys.details(), schoolId, studentId] as const,
};
