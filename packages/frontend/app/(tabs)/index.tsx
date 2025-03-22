import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { ProfileMenu } from '@/components/ProfileMenu';
import { User } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const { user } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const iconColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Home</ThemedText>

        <Pressable style={styles.profileButton} onPress={() => setShowMenu(!showMenu)}>
          <User size={24} color={iconColor} />
        </Pressable>
      </View>

      {showMenu && (
        <View style={styles.menuContainer}>
          <ProfileMenu />
        </View>
      )}

      <View style={styles.content}>
        <ThemedText style={styles.welcomeText}>
          Welcome, {user?.email?.split('@')[0] || 'User'}!
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileButton: {
    padding: 8,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 24,
  },
});
