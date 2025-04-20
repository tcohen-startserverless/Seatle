import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Home, GraduationCap, ListChecks } from 'lucide-react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useThemeColor } from '@/theme';
import { AuthGuard } from '@/components/AuthGuard';
import VerticalNavbar from '@/components/VerticalNavbar';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  content: {
    flex: 1,
  },
});

export default function TabLayout() {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  if (isWeb) {
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
            </Tabs>
          </View>
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tintColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {
              backgroundColor: backgroundColor,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="lists"
          options={{
            title: 'Lists',
            tabBarIcon: ({ color }) => <ListChecks size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="charts"
          options={{
            title: 'Charts',
            tabBarIcon: ({ color }) => <GraduationCap size={28} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
