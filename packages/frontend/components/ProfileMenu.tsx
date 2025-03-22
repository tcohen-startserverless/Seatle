import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { useAuthContext } from '@/context/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

export function ProfileMenu() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={24} color={iconColor} />
        </View>
        <View style={styles.userInfo}>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
          <ThemedText style={styles.role}>{user.role || 'User'}</ThemedText>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      
      <Pressable 
        style={styles.menuItem} 
        onPress={() => {}}
      >
        <Settings size={20} color={iconColor} />
        <ThemedText style={styles.menuItemText}>Settings</ThemedText>
      </Pressable>
      
      <Pressable 
        style={styles.menuItem} 
        onPress={handleLogout}
      >
        <LogOut size={20} color={iconColor} />
        <ThemedText style={styles.menuItemText}>Logout</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: 280,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  email: {
    fontWeight: '500',
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 12,
  },
});