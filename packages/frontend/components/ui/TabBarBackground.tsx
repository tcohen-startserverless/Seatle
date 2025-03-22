import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        intensity={80}
        tint={colorScheme}
      />
    );
  }

  return null;
}

export function useBottomTabOverflow() {
  return Platform.OS === 'ios' ? 16 : 0;
}