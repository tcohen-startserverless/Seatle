import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const iconColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <ChevronDown size={20} color={iconColor} />
        ) : (
          <ChevronRight size={20} color={iconColor} />
        )}
        <ThemedText type="subtitle">{title}</ThemedText>
      </Pressable>
      {isOpen && <View>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
