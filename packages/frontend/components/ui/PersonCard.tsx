import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PersonItem } from '@core/person';
import { Edit, Trash, ArrowRightLeft } from 'lucide-react';

type PersonCardProps = {
  person: PersonItem;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
};

const isWeb = Platform.OS === 'web';

export function PersonCard({ person, onEdit, onDelete, onMove }: PersonCardProps) {
  const iconColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'card');
  
  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.cardContent}>
        <View style={styles.nameContainer}>
          <ThemedText style={styles.name}>
            {person.firstName} {person.lastName}
          </ThemedText>
        </View>
        
        {person.email && (
          <ThemedText style={styles.detail}>Email: {person.email}</ThemedText>
        )}
        
        {person.phone && (
          <ThemedText style={styles.detail}>Phone: {person.phone}</ThemedText>
        )}
        
        {person.notes && (
          <ThemedText style={styles.notes}>{person.notes}</ThemedText>
        )}
      </View>
      
      <View style={styles.actions}>
        {onEdit && (
          <Pressable onPress={onEdit} style={styles.actionButton}>
            <Edit size={isWeb ? 20 : 16} color={iconColor} />
          </Pressable>
        )}
        {onMove && (
          <Pressable onPress={onMove} style={styles.actionButton}>
            <ArrowRightLeft size={isWeb ? 20 : 16} color={iconColor} />
          </Pressable>
        )}
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.actionButton}>
            <Trash size={isWeb ? 20 : 16} color="#ff4444" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 6,
  },
});