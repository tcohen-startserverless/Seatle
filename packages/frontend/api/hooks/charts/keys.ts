export const chartKeys = {
  all: ['charts'] as const,
  charts: () => [...chartKeys.all, 'chart'] as const,
  byChart: (userId: string, id: string) => [...chartKeys.charts(), userId, id] as const,
  list: (filters?: { status?: 'ACTIVE' | 'ARCHIVED'; cursor?: string }) =>
    [...chartKeys.charts(), { ...filters }] as const,
  detail: (id: string) => [...chartKeys.all, 'detail', id] as const,
  items: (chartId: string) => [...chartKeys.all, 'items', chartId] as const,
  assignments: (chartId: string) => [...chartKeys.all, 'assignments', chartId] as const,
};