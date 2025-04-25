export const chartKeys = {
  all: ['charts'] as const,
  charts: () => [...chartKeys.all, 'chart'] as const,
  byChart: (userId: string, chartId: string) => [...chartKeys.charts(), userId, chartId] as const,
  list: (filters?: { status?: 'ACTIVE' | 'ARCHIVED'; cursor?: string; userId?: string }) =>
    [...chartKeys.charts(), { ...filters }] as const,
  detail: (chartId: string) => [...chartKeys.all, 'detail', chartId] as const,
  furniture: (chartId: string) => [...chartKeys.all, 'furniture', chartId] as const,
  assignments: (chartId: string) => [...chartKeys.all, 'assignments', chartId] as const,
};