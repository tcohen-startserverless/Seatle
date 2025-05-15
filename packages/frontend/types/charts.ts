export type FurnitureType = 'TABLE' | 'CHAIR';

export type FurniturePosition = {
  id: string;
  x: number;
  y: number;
  size: number;
  type: FurnitureType;
  cells?: number;
  personId?: string;
  personName?: string;
};

export type ChartLayoutUpdateData = {
  furnitureToCreate: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: FurnitureType;
  }[];
  furnitureToUpdate: {
    id: string;
    data: {
      x: number;
      y: number;
      width: number;
      height: number;
      type: FurnitureType;
    };
  }[];
  furnitureToDelete: string[];
  assignmentsToCreate: { furnitureId: string; personId: string }[];
  assignmentsToDelete: string[];
};