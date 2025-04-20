import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';

export default function TabBarBackground() {
  const { theme } = useTheme();
  const tint = theme.id === 'dark' ? 'dark' : 'light';
  
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        intensity={80}
        tint={tint}
      />
    );
  }

  return null;
}

export function useBottomTabOverflow() {
  return Platform.OS === 'ios' ? 16 : 0;
}