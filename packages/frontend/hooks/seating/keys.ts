export const seatingKeys = {
  all: ['seating'] as const,
  lists: () => [...seatingKeys.all, 'list'] as const,
  list: (schoolId: string, classId: string) => 
    [...seatingKeys.lists(), schoolId, classId] as const,
  details: () => [...seatingKeys.all, 'detail'] as const,
  detail: (schoolId: string, classId: string, seatingId: string) => 
    [...seatingKeys.details(), schoolId, classId, seatingId] as const,
};