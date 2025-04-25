export const assignmentKeys = {
  all: ['assignments'] as const,
  assignment: () => [...assignmentKeys.all, 'assignment'] as const,
  lists: (chartId: string) => [...assignmentKeys.all, chartId, 'list'] as const,
  byPerson: (personId: string) => [...assignmentKeys.all, 'byPerson', personId] as const,
  byFurniture: (furnitureId: string) => [...assignmentKeys.all, 'byFurniture', furnitureId] as const,
  details: (chartId: string, id: string) => [...assignmentKeys.all, chartId, id] as const,
};