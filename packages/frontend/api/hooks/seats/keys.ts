export const seatKeys = {
  all: ['seats'] as const,
  seats: () => [...seatKeys.all, 'seat'] as const,
  lists: (chartId: string) => [...seatKeys.all, chartId, 'list'] as const,
  details: (chartId: string, id: string) => [...seatKeys.all, chartId, id] as const,
};