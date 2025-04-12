import { Modal, StyleSheet, View, Pressable, Platform, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { useListLists } from '@/api/hooks/lists';
import { useState } from 'react';

type MovePersonModalProps = {
  visible: boolean;
  onClose: () => void;
  onMove: (targetListId: string) => Promise<void>;
  isMoving: boolean;
  currentListId: string;
  personName: string;
};

const isWeb = Platform.OS === 'web';

export function MovePersonModal({
  visible,
  onClose,
  onMove,
  isMoving,
  currentListId,
  personName,
}: MovePersonModalProps) {
  const iconColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'card');
  const { data, isLoading } = useListLists();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleMove = async () => {
    if (selectedListId) {
      await onMove(selectedListId);
      onClose();
    }
  };

  const availableLists = data?.data?.filter(list => list.id !== currentListId) || [];

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <ThemedView
          style={[styles.modalContent, { maxWidth: isWeb ? 500 : '90%' }]}
        >
          <View style={styles.modalHeader}>
            <ThemedText type="title">Move Person</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={iconColor} />
            </Pressable>
          </View>

          <ThemedText style={styles.instructionText}>
            Select a list to move {personName} to:
          </ThemedText>

          {isLoading ? (
            <ThemedText style={styles.loadingText}>Loading lists...</ThemedText>
          ) : availableLists.length === 0 ? (
            <ThemedText style={styles.noListsText}>
              No other lists available. Create another list first.
            </ThemedText>
          ) : (
            <FlatList
              data={availableLists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.listItem, { backgroundColor: cardBackground }]}
                  onPress={() => setSelectedListId(item.id)}
                >
                  <ThemedText style={styles.listName}>{item.name}</ThemedText>
                  {selectedListId === item.id && (
                    <CheckCircle size={20} color="#0066ff" />
                  )}
                </Pressable>
              )}
              style={styles.listContainer}
            />
          )}

          <Button
            onPress={handleMove}
            style={styles.button}
            isLoading={isMoving}
            disabled={!selectedListId || isMoving}
          >
            Move
          </Button>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  instructionText: {
    marginBottom: 16,
    fontSize: 16,
  },
  listContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  noListsText: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});