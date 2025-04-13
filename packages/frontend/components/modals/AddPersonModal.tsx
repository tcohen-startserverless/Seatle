import { Modal, StyleSheet, View, Pressable, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { X } from 'lucide-react';
import { PersonForm } from '@/components/forms/PersonForm';
import { PersonSchema } from '@core/person';

type AddPersonModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: PersonSchema.Types.Create) => Promise<void>;
  isSubmitting: boolean;
  listId: string;
};

const isWeb = Platform.OS === 'web';

export function AddPersonModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
  listId,
}: AddPersonModalProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContent, { maxWidth: isWeb ? 500 : '90%' }]}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">Add Person</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={iconColor} />
            </Pressable>
          </View>

          <PersonForm
            onSubmit={async (values) => {
              await onSubmit(values);
              onClose();
            }}
            listId={listId}
            isSubmitting={isSubmitting}
            buttonText="Add Person"
          />
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
    overflow: 'hidden',
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
});
