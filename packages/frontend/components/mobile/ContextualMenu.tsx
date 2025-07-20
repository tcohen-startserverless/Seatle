import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/theme';
import { X, Trash2, RotateCw, Copy, User, UserMinus, Search } from 'lucide-react';
import { FurniturePosition, Person } from '@/types/furniture';
import { useResponsiveInfo, getTouchTargetSize } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ContextMenuAction =
  | 'assign-person'
  | 'remove-person'
  | 'rotate-furniture'
  | 'delete-furniture'
  | 'duplicate-furniture';

interface ContextualMenuProps {
  furniture: FurniturePosition & { personId?: string; personName?: string };
  visible: boolean;
  onClose: () => void;
  onAction: (action: ContextMenuAction, data?: any) => void;
  people?: Person[];
  isLoading?: boolean;
}

export function ContextualMenu({
  furniture,
  visible,
  onClose,
  onAction,
  people = [],
  isLoading = false,
}: ContextualMenuProps) {
  const { theme } = useTheme();
  const responsiveInfo = useResponsiveInfo();
  const { isMobile } = responsiveInfo;
  const insets = useSafeAreaInsets();
  const [showPersonAssignment, setShowPersonAssignment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const touchTargetHeight = getTouchTargetSize(56, isMobile);
  const isChair = furniture.type === 'CHAIR';
  const hasAssignment = Boolean(furniture.personId);

  const filteredPeople = people.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleAction = (action: ContextMenuAction, data?: any) => {
    onAction(action, data);
    if (action !== 'assign-person') {
      onClose();
    }
  };

  const handlePersonAssignment = (personId: string, personName: string) => {
    handleAction('assign-person', { personId, personName });
    setShowPersonAssignment(false);
    onClose();
  };

  const actions = [
    ...(isChair && !hasAssignment
      ? [
          {
            id: 'assign-person' as const,
            title: 'Assign Person',
            icon: <User size={20} color={theme.colors.text} />,
            onPress: () => setShowPersonAssignment(true),
          },
        ]
      : []),

    ...(isChair && hasAssignment
      ? [
          {
            id: 'remove-person' as const,
            title: 'Remove Person',
            icon: <UserMinus size={20} color={theme.colors.error} />,
            onPress: () => handleAction('remove-person'),
          },
        ]
      : []),

    {
      id: 'rotate-furniture' as const,
      title: 'Rotate',
      icon: <RotateCw size={20} color={theme.colors.text} />,
      onPress: () => handleAction('rotate-furniture'),
    },

    {
      id: 'duplicate-furniture' as const,
      title: 'Duplicate',
      icon: <Copy size={20} color={theme.colors.text} />,
      onPress: () => handleAction('duplicate-furniture'),
    },

    {
      id: 'delete-furniture' as const,
      title: 'Delete',
      icon: <Trash2 size={20} color={theme.colors.error} />,
      onPress: () => handleAction('delete-furniture'),
      isDestructive: true,
    },
  ];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <ThemedText type="subtitle">{isChair ? 'Chair' : 'Table'} Actions</ThemedText>
            <Pressable
              onPress={onClose}
              style={[styles.closeButton, { minHeight: touchTargetHeight }]}
            >
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!showPersonAssignment ? (
              // Main actions
              <View style={styles.actionsContainer}>
                {furniture.personName && (
                  <View
                    style={[
                      styles.assignmentInfo,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    <ThemedText style={styles.assignmentLabel}>Assigned to:</ThemedText>
                    <ThemedText style={styles.assignmentName}>
                      {furniture.personName}
                    </ThemedText>
                  </View>
                )}

                {actions.map((action) => (
                  <Pressable
                    key={action.id}
                    style={[
                      styles.actionButton,
                      {
                        minHeight: touchTargetHeight,
                        backgroundColor: action.isDestructive
                          ? `${theme.colors.error}10`
                          : theme.colors.card,
                        borderColor: action.isDestructive
                          ? theme.colors.error
                          : theme.colors.border,
                      },
                    ]}
                    onPress={action.onPress}
                  >
                    <View style={styles.actionIcon}>{action.icon}</View>
                    <ThemedText
                      style={[
                        styles.actionTitle,
                        action.isDestructive && { color: theme.colors.error },
                      ]}
                    >
                      {action.title}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            ) : (
              // Person assignment
              <View style={styles.personAssignmentContainer}>
                <View style={styles.searchContainer}>
                  <Search size={20} color={theme.colors.text} />
                  <TextInput
                    style={[
                      styles.searchInput,
                      {
                        color: theme.colors.text,
                        backgroundColor: theme.colors.inputBackground,
                      },
                    ]}
                    placeholder="Search people..."
                    placeholderTextColor={theme.colors.placeholderText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ThemedText>Loading people...</ThemedText>
                  </View>
                ) : filteredPeople.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <ThemedText>
                      {searchQuery ? 'No people found' : 'No people available'}
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.peopleList}>
                    {filteredPeople.map((person) => (
                      <Pressable
                        key={person.id}
                        style={[
                          styles.personItem,
                          {
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border,
                            minHeight: touchTargetHeight,
                          },
                        ]}
                        onPress={() =>
                          handlePersonAssignment(
                            person.id,
                            `${person.firstName} ${person.lastName}`
                          )
                        }
                      >
                        <View style={styles.personInfo}>
                          <ThemedText style={styles.personName}>
                            {`${person.firstName} ${person.lastName}`}
                          </ThemedText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}

                <Pressable
                  style={[
                    styles.backButton,
                    {
                      backgroundColor: theme.colors.border,
                      minHeight: touchTargetHeight,
                    },
                  ]}
                  onPress={() => setShowPersonAssignment(false)}
                >
                  <ThemedText>Back to Actions</ThemedText>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    minHeight: '30%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    paddingTop: 16,
  },
  assignmentInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  assignmentLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  assignmentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  personAssignmentContainer: {
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 40,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  peopleList: {
    marginBottom: 16,
  },
  personItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
});
