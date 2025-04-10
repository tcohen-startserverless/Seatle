export const listKeys = {
  all: ['lists'] as const,
  lists: () => [...listKeys.all, 'list'] as const,
  byList: (userId: string, id: string) => [...listKeys.lists(), userId, id] as const,
  list: (filters?: { status?: 'ACTIVE' | 'ARCHIVED'; cursor?: string }) =>
    [...listKeys.lists(), { ...filters }] as const,
  detail: (id: string) => [...listKeys.all, 'detail', id] as const,
};
