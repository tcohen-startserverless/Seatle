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