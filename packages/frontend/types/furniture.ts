export type FurnitureType = 'TABLE' | 'CHAIR';

export interface FurniturePosition {
  id: string;
  x: number;
  y: number;
  size: number;
  type: FurnitureType;
  cells?: number;
  personId?: string;
  personName?: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface FurnitureSizeItem {
  id: string;
  size: number;
  type: FurnitureType;
}

export const TABLE_SIZES: FurnitureSizeItem[] = [
  { id: 'table', size: 75, type: 'TABLE' },
];

export const CHAIR_SIZES: FurnitureSizeItem[] = [
  { id: 'chair', size: 25, type: 'CHAIR' },
];
