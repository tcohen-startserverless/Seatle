import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { useAuthContext } from '@/context/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';
import { useTheme, useRadius, useSpacing, useTypography } from '@/theme';
import { useRouter } from 'expo-router';

export function ProfileMenu() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const { theme } = useTheme();
  const radius = useRadius();
  const spacing = useSpacing();
  const typography = useTypography();
  
  const iconColor = theme.colors.text;
  const borderColor = theme.colors.border;

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View style={[
      styles.container, 
      { 
        borderColor,
        borderRadius: radius.md,
        padding: spacing.md,
        width: 280,
      }
    ]}>
      <View style={[styles.header, { marginBottom: spacing.md }]}>
        <View style={[
          styles.avatar, 
          { 
            marginRight: spacing.md,
            borderRadius: radius.full / 2, // Half of full for circle
          }
        ]}>
          <User size={24} color={iconColor} />
        </View>
        <View style={styles.userInfo}>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
          <ThemedText style={[
            styles.role, 
            { fontSize: typography.fontSize.xs }
          ]}>{user.role || 'User'}</ThemedText>
        </View>
      </View>
      
      <View style={[
        styles.divider, 
        { 
          backgroundColor: borderColor,
          marginVertical: spacing.md,
        }
      ]} />
      
      <Pressable 
        style={[styles.menuItem, { paddingVertical: spacing.md }]} 
        onPress={() => {}}
      >
        <Settings size={20} color={iconColor} />
        <ThemedText style={[styles.menuItemText, { marginLeft: spacing.md }]}>Settings</ThemedText>
      </Pressable>
      
      <Pressable 
        style={[styles.menuItem, { paddingVertical: spacing.md }]}
        onPress={handleLogout}
      >
        <LogOut size={20} color={iconColor} />
        <ThemedText style={[styles.menuItemText, { marginLeft: spacing.md }]}>Logout</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  email: {
    fontWeight: '500',
    marginBottom: 4,
  },
  role: {
    opacity: 0.7,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
  },
});