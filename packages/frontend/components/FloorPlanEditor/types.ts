import { GestureResponderEvent } from 'react-native';

export interface FurniturePosition {
  id: string;
  x: number;
  y: number;
  size: number;
  cells?: number;
  type: 'TABLE' | 'CHAIR';
  personId?: string;
  personName?: string;
}

export interface ViewDimensions {
  width: number;
  height: number;
}

export interface SeatingChartProps {
  cellSize?: number;
  minRows?: number;
  minColumns?: number;
  maxRows?: number;
  maxColumns?: number;
  edgePadding?: number;
  furniture: FurniturePosition[];
  onFurnitureUpdate: (furniture: FurniturePosition[]) => void;
  onChairAssign?: (chairId: string) => void;
}

export interface FurnitureElementsProps {
  furniture: FurniturePosition[];
  selectedItemId: string | null;
  cellSize: number;
  onItemPress: (id: string) => void;
  onDeleteItem: (id: string, e: GestureResponderEvent) => void;
  onChairAssign?: (chairId: string) => void;
}
