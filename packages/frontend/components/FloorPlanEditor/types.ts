import { GestureResponderEvent } from 'react-native';

export interface TablePosition {
  id: string;
  x: number;
  y: number;
  size: number;
  cells: number;
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
  tables: TablePosition[];
  onTableUpdate: (tables: TablePosition[]) => void;
}

export interface TablesProps {
  tables: TablePosition[];
  selectedTableId: string | null;
  cellSize: number;
  onTablePress: (id: string) => void;
  onDeleteTable: (id: string, e: GestureResponderEvent) => void;
}
