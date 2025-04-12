import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ThemedText } from './ThemedText';
import { Home, Users, GraduationCap, ListChecks } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  route: string;
  isActive: boolean;
}

function NavItem({ title, icon, route, isActive }: NavItemProps) {
  const router = useRouter();
  const activeBackground = useThemeColor({}, 'tint');
  const inactiveBackground = useThemeColor({}, 'background');
  const activeTextColor = '#FFFFFF';
  const inactiveTextColor = useThemeColor({}, 'text');

  return (
    <Pressable
      style={[
        styles.navItem,
        { backgroundColor: isActive ? activeBackground : inactiveBackground },
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
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

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
          <ThemedText style={styles.logoText}>Seater</ThemedText>
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
