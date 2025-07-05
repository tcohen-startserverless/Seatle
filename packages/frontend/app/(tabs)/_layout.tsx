import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Home, GraduationCap, ListChecks, User } from 'lucide-react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useReactiveThemeColor, useSpacing } from '@/theme';
import { AuthGuard } from '@/components/AuthGuard';
import VerticalNavbar from '@/components/VerticalNavbar';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  mobileTabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default function TabLayout() {
  const tintColor = useReactiveThemeColor({}, 'tint');
  const backgroundColor = useReactiveThemeColor({}, 'background');
  const spacing = useSpacing();
  const insets = useSafeAreaInsets();
  const { navigationStyle, touchFirst, isDesktop, isMobile, getIconSize } =
    useAdaptiveDesign();

  // Desktop with sidebar navigation
  if (isDesktop && navigationStyle === 'sidebar') {
    return (
      <AuthGuard>
        <View style={styles.container}>
          <VerticalNavbar />
          <View style={styles.content}>
            <Tabs
              screenOptions={{
                tabBarStyle: { display: 'none' },
                headerShown: false,
              }}
            >
              <Tabs.Screen name="index" />
              <Tabs.Screen name="lists" />
              <Tabs.Screen name="charts" />
              <Tabs.Screen name="profile" />
            </Tabs>
          </View>
        </View>
      </AuthGuard>
    );
  }

  // Mobile-first bottom tab navigation
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tintColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: [
            styles.mobileTabBar,
            {
              backgroundColor: backgroundColor,
              paddingBottom: Math.max(insets.bottom, spacing.sm),
              height: 60 + Math.max(insets.bottom, spacing.sm),
            },
          ],
          tabBarIconStyle: {
            marginTop: spacing.xs,
          },
          tabBarLabelStyle: {
            fontSize: touchFirst ? 12 : 11,
            fontWeight: '600',
            marginBottom: spacing.xs,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={getIconSize('tab')} color={color} />,
          }}
        />
        <Tabs.Screen
          name="lists"
          options={{
            title: 'Lists',
            tabBarIcon: ({ color }) => (
              <ListChecks size={getIconSize('tab')} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="charts"
          options={{
            title: 'Charts',
            tabBarIcon: ({ color }) => (
              <GraduationCap size={getIconSize('tab')} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={getIconSize('tab')} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
