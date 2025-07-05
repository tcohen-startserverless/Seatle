import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ThemedText } from './ThemedText';
import {
  Home,
  Users,
  GraduationCap,
  ListChecks,
  User,
  ChevronUp,
  LogOut,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useThemeManager, useReactiveThemeColor } from '@/theme';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  route: string;
  isActive: boolean;
}

function NavItem({ title, icon, route, isActive }: NavItemProps) {
  const router = useRouter();
  const activeBackground = useReactiveThemeColor({}, 'tint');
  const inactiveBackground = useReactiveThemeColor({}, 'background');
  const pressedBackground = useReactiveThemeColor({}, 'border');
  const activeTextColor = '#FFFFFF';
  const inactiveTextColor = useReactiveThemeColor({}, 'icon');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.navItem,
        {
          backgroundColor: isActive
            ? activeBackground
            : pressed
              ? pressedBackground
              : inactiveBackground,
          opacity: pressed && !isActive ? 0.8 : 1,
        },
      ]}
      onPress={() => router.push(route)}
    >
      {React.cloneElement(icon as React.ReactElement, {
        color: isActive ? activeTextColor : inactiveTextColor,
        size: 22,
      })}
      <ThemedText
        style={[
          styles.navItemText,
          { color: isActive ? activeTextColor : inactiveTextColor },
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const VerticalNavbar = () => {
  const pathname = usePathname();
  const backgroundColor = useReactiveThemeColor({}, 'sidebar');
  const borderColor = useReactiveThemeColor({}, 'border');
  const textColor = useReactiveThemeColor({}, 'text');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuthContext();
  const { colorScheme, toggleTheme } = useThemeManager();
  const router = useRouter();

  const isActive = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  const navItems = [
    { title: 'Home', icon: <Home />, route: '/' },
    { title: 'Lists', icon: <ListChecks />, route: '/lists' },
    { title: 'Charts', icon: <GraduationCap />, route: '/charts' },
  ];

  return (
    <View style={[styles.navbar, { backgroundColor, borderRightColor: borderColor }]}>
      <View style={styles.navContent}>
        <View style={styles.logo}>
          <ThemedText style={styles.logoText}>Seatle</ThemedText>
        </View>

        <View style={styles.navItems}>
          {navItems.map((item) => (
            <NavItem
              key={item.route}
              title={item.title}
              icon={item.icon}
              route={item.route}
              isActive={isActive(item.route)}
            />
          ))}
        </View>

        <View style={[styles.profileSection, { borderTopColor: borderColor }]}>
          <Pressable
            style={[
              styles.profileButton,
              { backgroundColor: showProfileMenu ? borderColor : 'transparent' },
            ]}
            onPress={() => setShowProfileMenu(!showProfileMenu)}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileAvatar}>
                <User size={16} color={textColor} />
              </View>
              <View style={styles.profileDetails}>
                <ThemedText style={styles.profileName} numberOfLines={1}>
                  {user?.email?.split('@')[0] || 'User'}
                </ThemedText>
                <ThemedText style={styles.profileEmail} numberOfLines={1}>
                  {user?.email
                    ? user.email.length > 20
                      ? user.email.substring(0, 20) + '...'
                      : user.email
                    : 'user@example.com'}
                </ThemedText>
              </View>
            </View>
            <ChevronUp
              size={16}
              color={textColor}
              style={{
                opacity: 0.6,
                transform: [{ rotate: showProfileMenu ? '0deg' : '180deg' }] as any,
              }}
            />
          </Pressable>

          {showProfileMenu && (
            <>
              <TouchableWithoutFeedback onPress={() => setShowProfileMenu(false)}>
                <View style={styles.backdrop} />
              </TouchableWithoutFeedback>
              <View style={styles.profileMenuContainer}>
                <View
                  style={[
                    styles.compactProfileMenu,
                    {
                      backgroundColor: backgroundColor,
                      borderColor: borderColor,
                    },
                  ]}
                >
                  <Pressable
                    style={styles.profileMenuItem}
                    onPress={() => {
                      setShowProfileMenu(false);
                      // TODO: Navigate to settings
                    }}
                  >
                    <Settings size={16} color={textColor} />
                    <ThemedText style={styles.profileMenuText}>Settings</ThemedText>
                  </Pressable>
                  <View
                    style={[styles.profileMenuDivider, { backgroundColor: borderColor }]}
                  />
                  <Pressable
                    style={styles.profileMenuItem}
                    onPress={() => {
                      setShowProfileMenu(false);
                      toggleTheme();
                    }}
                  >
                    {colorScheme === 'dark' ? (
                      <Sun size={16} color={textColor} />
                    ) : (
                      <Moon size={16} color={textColor} />
                    )}
                    <ThemedText style={styles.profileMenuText}>
                      {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </ThemedText>
                  </Pressable>
                  <View
                    style={[styles.profileMenuDivider, { backgroundColor: borderColor }]}
                  />
                  <Pressable
                    style={styles.profileMenuItem}
                    onPress={async () => {
                      setShowProfileMenu(false);
                      try {
                        await logout();
                        router.replace('/auth/login');
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                  >
                    <LogOut size={16} color={textColor} />
                    <ThemedText style={styles.profileMenuText}>Logout</ThemedText>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    width: 220,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  navContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
  },
  logo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
  },
  navItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    position: 'relative',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileDetails: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    opacity: 0.6,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  profileMenuContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 12,
    right: 12,
    marginBottom: 8,
    zIndex: 1000,
  },
  compactProfileMenu: {
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profileMenuText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  profileMenuDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  navItemText: {
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default VerticalNavbar;
