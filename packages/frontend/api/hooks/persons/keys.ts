export const personKeys = {
  all: ['persons'] as const,
  persons: () => [...personKeys.all, 'person'] as const,
  byPerson: (userId: string, id: string) => [...personKeys.persons(), userId, id] as const,
  list: (filters?: { lastName?: string; firstName?: string; cursor?: string }) =>
    [...personKeys.persons(), { ...filters }] as const,
  detail: (id: string) => [...personKeys.all, 'detail', id] as const,
};