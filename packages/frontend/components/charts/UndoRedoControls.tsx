import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/theme';
import { Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  historySize?: number;
  showHistoryCount?: boolean;
}

export function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  historySize = 0,
  showHistoryCount = false,
}: UndoRedoControlsProps) {
  const iconColor = useThemeColor({}, 'text');
  const disabledColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z (Undo)
      if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          onUndo();
        }
      }

      // Check for Ctrl+Y or Ctrl+Shift+Z (Redo)
      if (
        (event.ctrlKey && event.key === 'y') ||
        (event.ctrlKey && event.shiftKey && event.key === 'Z')
      ) {
        event.preventDefault();
        if (canRedo) {
          onRedo();
        }
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, onUndo, onRedo]);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.button, { opacity: canUndo ? 1 : 0.5 }]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Undo size={18} color={canUndo ? iconColor : disabledColor} />
          <ThemedText
            style={[styles.buttonText, { color: canUndo ? iconColor : disabledColor }]}
          >
            Undo
          </ThemedText>
        </Pressable>

        <View style={[styles.separator, { backgroundColor: borderColor }]} />

        <Pressable
          style={[styles.button, { opacity: canRedo ? 1 : 0.5 }]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Redo size={18} color={canRedo ? iconColor : disabledColor} />
          <ThemedText
            style={[styles.buttonText, { color: canRedo ? iconColor : disabledColor }]}
          >
            Redo
          </ThemedText>
        </Pressable>
      </View>

      {showHistoryCount && (
        <View style={styles.historyInfo}>
          <ThemedText style={styles.historyText}>{historySize} states</ThemedText>
        </View>
      )}

      <View style={styles.shortcutsInfo}>
        <ThemedText style={styles.shortcutText}>Ctrl+Z • Ctrl+Y</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 24,
    marginHorizontal: 4,
  },
  historyInfo: {
    alignItems: 'center',
    marginBottom: 4,
  },
  historyText: {
    fontSize: 12,
    opacity: 0.7,
  },
  shortcutsInfo: {
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 11,
    opacity: 0.5,
    fontFamily: 'monospace',
  },
});
