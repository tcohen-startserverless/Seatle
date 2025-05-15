import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Save } from 'lucide-react';
import { useThemeColor } from '@/theme';

interface ChartActionsProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function ChartActions({ onSave, isSaving }: ChartActionsProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Pressable
      style={[
        styles.saveButton,
        { backgroundColor: tintColor, opacity: isSaving ? 0.7 : 1 },
      ]}
      onPress={onSave}
      disabled={isSaving}
    >
      <View style={styles.buttonContent}>
        {isSaving ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Save size={18} color="white" />
        )}
        <ThemedText style={styles.buttonText}>
          {isSaving ? 'Saving...' : 'Save Layout'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});