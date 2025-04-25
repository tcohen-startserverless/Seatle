import { ChartsResponse } from './types';

export interface TransformedChartResponse {
  id: string;
  name: string;
  description?: string;
  listId: string;
  width: number;
  height: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: number;
  updatedAt: number;
  furniture: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    type: 'TABLE' | 'DESK' | 'CHAIR' | 'OTHER';
    label?: string;
    notes?: string;
  }[];
  assignments: {
    id: string;
    furnitureId: string;
    personId: string;
    createdAt: number;
    updatedAt: number;
  }[];
}

export function transformChartResponse(response: ChartsResponse) {
  const chartItems = response.data.Chart;
  if (!chartItems || chartItems.length === 0) return null;
  const chart = chartItems[0];
  if (!chart) return null;
  const furniture = response.data.Furniture || [];
  const assignments = response.data.Assignment || [];
  return {
    id: chart.chartId,
    name: chart.name,
    description: chart.description,
    listId: chart.listId,
    width: chart.width,
    height: chart.height,
    status: chart.status,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    furniture: furniture.map((item) => ({
      id: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      rotation: item.rotation,
      type: item.type,
      label: item.label,
      notes: item.notes,
    })),
    assignments: assignments.map((item) => ({
      id: item.id,
      furnitureId: item.furnitureId,
      personId: item.personId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  };
}
