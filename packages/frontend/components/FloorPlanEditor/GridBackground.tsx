import { View, StyleSheet } from 'react-native';

interface GridProps {
  rows: number;
  columns: number;
  cellSize: number;
  borderColor: string;
}

export function Grid({ rows, columns, cellSize, borderColor }: GridProps) {
  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(
          <View
            key={`cell-${i}-${j}`}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                borderColor,
              },
            ]}
          />
        );
      }
      grid.push(
        <View key={`row-${i}`} style={styles.row}>
          {row}
        </View>
      );
    }

    return grid;
  };

  return <>{renderGrid()}</>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
  },
});
