import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme, useRadius } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  const { theme } = useTheme();
  const radius = useRadius();
  const backgroundColor = theme.colors.card;
  const borderColor = theme.colors.border;
  
  const cardContent = (
    <View style={[
      styles.container, 
      { 
        backgroundColor, 
        borderColor,
        borderRadius: radius.lg
      }, 
      style
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pressable: {
    width: '100%',
  },
});