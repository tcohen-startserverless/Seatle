import { FurniturePosition } from '@/types/charts';

export function hasCollision(
  itemToCheck: FurniturePosition,
  allItems: FurniturePosition[]
): boolean {
  for (const item of allItems) {
    if (item.id === itemToCheck.id) continue;

    const rect1 = {
      left: itemToCheck.x,
      right: itemToCheck.x + Math.floor(itemToCheck.size / 25),
      top: itemToCheck.y,
      bottom: itemToCheck.y + Math.floor(itemToCheck.size / 25),
    };
    const rect2 = {
      left: item.x,
      right: item.x + Math.floor(item.size / 25),
      top: item.y,
      bottom: item.y + Math.floor(item.size / 25),
    };
    if (
      !(
        rect1.right <= rect2.left ||
        rect1.left >= rect2.right ||
        rect1.bottom <= rect2.top ||
        rect1.top >= rect2.bottom
      )
    ) {
      return true;
    }
  }
  return false;
}

export function findNonCollidingPosition(
  newItem: FurniturePosition,
  furniture: FurniturePosition[]
): FurniturePosition {
  if (!hasCollision(newItem, furniture)) {
    return newItem;
  }

  let placed = false;
  const updatedItem = { ...newItem };
  
  for (let y = 0; y < 60 && !placed; y++) {
    for (let x = 0; x < 60 && !placed; x++) {
      const testPosition = { ...newItem, x, y };
      if (!hasCollision(testPosition, furniture)) {
        updatedItem.x = x;
        updatedItem.y = y;
        placed = true;
      }
    }
  }
  
  return updatedItem;
}