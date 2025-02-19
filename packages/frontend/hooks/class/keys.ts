export const ClassKeys = {
  all: ['classes'] as const,
  list: (schoolId: string) => [...ClassKeys.all, 'list', schoolId] as const,
  detail: (classId: string) => [...ClassKeys.all, 'detail', classId] as const,
};
