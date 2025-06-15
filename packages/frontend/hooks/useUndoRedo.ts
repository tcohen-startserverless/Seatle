import { useCallback, useRef, useState } from 'react';

interface UndoRedoOptions {
  maxHistorySize?: number;
}

interface UndoRedoState<T> {
  history: T[];
  currentIndex: number;
}

interface UndoRedoReturn<T> {
  state: T;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushState: (newState: T) => void;
  clearHistory: () => void;
  historySize: number;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions = {}
): UndoRedoReturn<T> {
  const { maxHistorySize = 50 } = options;

  const [undoRedoState, setUndoRedoState] = useState<UndoRedoState<T>>({
    history: [initialState],
    currentIndex: 0,
  });

  // Use ref to track if we should skip the next state push
  // This helps prevent infinite loops when state updates trigger effects
  const skipNextPush = useRef(false);

  const currentState = undoRedoState.history[undoRedoState.currentIndex] ?? initialState;
  const canUndo = undoRedoState.currentIndex > 0;
  const canRedo = undoRedoState.currentIndex < undoRedoState.history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setUndoRedoState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex - 1,
    }));

    skipNextPush.current = true;
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setUndoRedoState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));

    skipNextPush.current = true;
  }, [canRedo]);

  const pushState = useCallback(
    (newState: T) => {
      // Skip if this is triggered by undo/redo
      if (skipNextPush.current) {
        skipNextPush.current = false;
        return;
      }

      // Don't add duplicate states
      if (JSON.stringify(newState) === JSON.stringify(currentState)) {
        return;
      }

      setUndoRedoState((prev) => {
        // If we're not at the end of history, remove everything after current position
        // This handles the case where user undoes some actions then makes a new change
        const newHistory = prev.history.slice(0, prev.currentIndex + 1);

        // Add the new state
        newHistory.push(newState);

        // Trim history if it exceeds max size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift(); // Remove oldest state
          return {
            history: newHistory,
            currentIndex: newHistory.length - 1,
          };
        }

        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      });
    },
    [currentState, maxHistorySize]
  );

  const clearHistory = useCallback(() => {
    const stateToKeep = currentState ?? initialState;
    setUndoRedoState({
      history: [stateToKeep],
      currentIndex: 0,
    });
  }, [currentState, initialState]);

  return {
    state: currentState,
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    clearHistory,
    historySize: undoRedoState.history.length,
  };
}

// Utility function to create a deep clone of state
// This ensures that history states are immutable
export function createStateSnapshot<T>(state: T): T {
  return JSON.parse(JSON.stringify(state));
}

// Hook variant specifically for chart editor state
export interface ChartEditorState {
  furniture: any[];
  assignments: Record<string, { id: string; personId: string }>;
}

export function useChartUndoRedo(initialState: ChartEditorState) {
  return useUndoRedo<ChartEditorState>(initialState, {
    maxHistorySize: 30, // Smaller history for complex chart state
  });
}
