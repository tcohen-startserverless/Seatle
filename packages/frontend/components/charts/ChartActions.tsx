import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Save } from 'lucide-react';
import { useThemeColor } from '@/theme';
import { useResponsiveInfo, getTouchTargetSize } from '@/utils/responsive';

interface ChartActionsProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function ChartActions({ onSave, isSaving }: ChartActionsProps) {
  const tintColor = useThemeColor({}, 'tint');
  const responsiveInfo = useResponsiveInfo();
  const { isMobile } = responsiveInfo;

  const touchTargetHeight = getTouchTargetSize(44, isMobile);

  return (
    <Pressable
      style={[
        styles.saveButton,
        isMobile && [styles.mobileSaveButton, { minHeight: touchTargetHeight }],
        { backgroundColor: tintColor, opacity: isSaving ? 0.7 : 1 },
      ]}
      onPress={onSave}
      disabled={isSaving}
    >
      <View style={styles.buttonContent}>
        {isSaving ? (
          <ActivityIndicator size={isMobile ? 'small' : 'small'} color="white" />
        ) : (
          <Save size={isMobile ? 20 : 18} color="white" />
        )}
        <ThemedText style={[styles.buttonText, isMobile && styles.mobileButtonText]}>
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
  mobileSaveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
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
  mobileButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
