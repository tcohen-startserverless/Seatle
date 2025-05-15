import { FurniturePosition } from '@/types/furniture';

export const hasCollision = (
  itemToCheck: FurniturePosition,
  allItems: FurniturePosition[]
): boolean => {
  return allItems.some(
    (table) => table.id !== itemToCheck.id && checkCollision(itemToCheck, table)
  );
};

const checkCollision = (
  table1: FurniturePosition,
  table2: FurniturePosition
): boolean => {
  const rect1 = {
    left: table1.x,
    right: table1.x + Math.floor(table1.size / 25),
    top: table1.y,
    bottom: table1.y + Math.floor(table1.size / 25),
  };

  const rect2 = {
    left: table2.x,
    right: table2.x + Math.floor(table2.size / 25),
    top: table2.y,
    bottom: table2.y + Math.floor(table2.size / 25),
  };

  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right ||
    rect1.bottom <= rect2.top ||
    rect1.top >= rect2.bottom
  );
};
