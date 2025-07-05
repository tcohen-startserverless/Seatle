import React, { useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useTheme, useSpacing, useRadius } from '@/theme';
import { ThemedText } from '@/components/ThemedText';
import { X } from 'lucide-react';
import { TouchTarget } from './TouchTarget';

export type PanelVariant = 'sheet' | 'sidebar' | 'modal' | 'fullscreen';

export interface SimpleAdaptivePanelProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;

  // Content
  title?: string;
  subtitle?: string;

  // Layout behavior
  variant?: PanelVariant | 'auto';

  // Interaction
  enableBackdropDismiss?: boolean;
  enableHardwareBackPress?: boolean;

  // Styling
  maxWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const SimpleAdaptivePanel: React.FC<SimpleAdaptivePanelProps> = ({
  children,
  isVisible,
  onClose,
  title,
  subtitle,
  variant = 'auto',
  enableBackdropDismiss = true,
  enableHardwareBackPress = true,
  maxWidth = 400,
  backgroundColor,
  borderRadius,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const insets = useSafeAreaInsets();
  const { isMobile, isTablet, isDesktop, modalStyle, touchFirst } = useAdaptiveDesign();

  // Determine actual variant to use
  const actualVariant =
    variant === 'auto' ? (isMobile ? 'sheet' : isDesktop ? 'sidebar' : 'modal') : variant;

  // Hardware back press handling
  useEffect(() => {
    if (!enableHardwareBackPress || Platform.OS === 'ios') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, enableHardwareBackPress, onClose]);

  // Backdrop press
  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      onClose();
    }
  };

  // Render header
  const renderHeader = () => {
    if (!title) return null;

    return (
      <View
        style={[
          styles.header,
          { paddingHorizontal: spacing.md, borderBottomColor: theme.colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
        </View>

        <TouchTarget
          onPress={onClose}
          variant="minimal"
          size="small"
          accessibilityLabel="Close panel"
          accessibilityRole="button"
        >
          <X size={24} color={theme.colors.text} />
        </TouchTarget>
      </View>
    );
  };

  // Render content
  const renderContent = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, { paddingHorizontal: spacing.md }]}
      showsVerticalScrollIndicator={!touchFirst}
    >
      {children}
    </ScrollView>
  );

  // Desktop sidebar
  if (actualVariant === 'sidebar') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={onClose}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.sidebarContainer}>
          <View style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          </View>

          <View
            style={[
              styles.sidebar,
              {
                maxWidth,
                backgroundColor: backgroundColor || theme.colors.background,
                borderRadius: borderRadius || radius.lg,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: spacing.md,
                paddingRight: spacing.md,
              },
            ]}
          >
            {renderHeader()}
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }

  // Mobile bottom sheet
  if (actualVariant === 'sheet') {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        presentationStyle="pageSheet"
        statusBarTranslucent
        onRequestClose={onClose}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
          </View>

          <View
            style={[
              styles.sheet,
              {
                backgroundColor: backgroundColor || theme.colors.background,
                borderRadius: borderRadius || radius.lg,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            {/* Drag handle indicator */}
            <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
            {renderHeader()}
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }

  // Fallback modal
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        </View>

        <View
          style={[
            styles.modal,
            {
              maxWidth,
              backgroundColor: backgroundColor || theme.colors.background,
              borderRadius: borderRadius || radius.lg,
              padding: spacing.md,
            },
          ]}
        >
          {renderHeader()}
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // Sidebar
  sidebarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebar: {
    height: '100%',
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Bottom sheet
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    minHeight: 200,
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  // Drag handle
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
});
