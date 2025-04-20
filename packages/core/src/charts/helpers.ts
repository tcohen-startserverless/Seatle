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
  seats: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    type: 'TABLE' | 'DESK' | 'CHAIR' | 'OTHER';
    label?: string;
    notes?: string;
    personId?: string;
  }[];
  seating: {
    id: string;
    name: string;
    rows: number;
    columns: number;
    status: 'ACTIVE' | 'ARCHIVED';
  }[];
}

export function transformChartResponse(response: ChartsResponse) {
  const chartItems = response.data.Chart;
  if (!chartItems || chartItems.length === 0) return null;
  const chart = chartItems[0];
  if (!chart) return null;
  const seats = response.data.Seat || [];
  const seatingConfigs = response.data.Seating || [];
  return {
    ...response,
    id: chart.chartId,
    name: chart.name,
    description: chart.description,
    listId: chart.listId,
    width: chart.width,
    height: chart.height,
    status: chart.status,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    seats: seats.map((seat) => ({
      id: seat.id,
      x: seat.x,
      y: seat.y,
      width: seat.width,
      height: seat.height,
      rotation: seat.rotation,
      type: seat.type,
      label: seat.label,
      notes: seat.notes,
      personId: seat.personId,
    })),
    seating: seatingConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      rows: config.rows,
      columns: config.columns,
      status: config.status,
    })),
  };
}
