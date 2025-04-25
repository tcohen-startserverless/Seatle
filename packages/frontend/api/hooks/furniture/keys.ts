export const furnitureKeys = {
  all: ['furniture'] as const,
  furniture: () => [...furnitureKeys.all, 'furniture'] as const,
  lists: (chartId: string) => [...furnitureKeys.all, chartId, 'list'] as const,
  details: (chartId: string, id: string) => [...furnitureKeys.all, chartId, id] as const,
};