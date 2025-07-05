import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import {
  useTheme,
  useSpacing,
  useRadius,
  useTypography,
  useThemeManager,
  useReactiveThemeColor,
} from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useResponsiveStyles } from '@/hooks/useResponsiveStyles';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Mail,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

function ProfileItem({
  icon,
  title,
  description,
  onPress,
  showChevron = true,
  isDestructive = false,
}: ProfileItemProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const radius = useRadius();
  const { text } = useResponsiveStyles();

  return (
    <Pressable
      style={[
        styles.profileItem,
        {
          backgroundColor: theme.colors.card,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.profileItemContent}>
        <View style={styles.profileItemLeft}>
          <View
            style={[
              styles.profileItemIcon,
              {
                backgroundColor: isDestructive
                  ? 'rgba(255, 59, 48, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                borderRadius: radius.sm,
              },
            ]}
          >
            {React.cloneElement(icon as React.ReactElement, {
              size: 20,
              color: isDestructive ? theme.colors.error : theme.colors.tint,
            })}
          </View>
          <View style={styles.profileItemText}>
            <ThemedText
              style={[
                styles.profileItemTitle,
                text.size('body'),
                text.weight('medium'),
                { color: isDestructive ? theme.colors.error : theme.colors.text },
              ]}
            >
              {title}
            </ThemedText>
            {description && (
              <ThemedText
                style={[
                  styles.profileItemDescription,
                  text.size('caption'),
                  { opacity: 0.6 },
                ]}
              >
                {description}
              </ThemedText>
            )}
          </View>
        </View>
        {showChevron && (
          <ChevronRight size={16} color={theme.colors.text} style={{ opacity: 0.4 }} />
        )}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const { theme } = useTheme();
  const { colorScheme, toggleTheme } = useThemeManager();
  const spacing = useSpacing();
  const radius = useRadius();
  const typography = useTypography();
  const insets = useSafeAreaInsets();
  const { touchFirst } = useAdaptiveDesign();
  const { text, size } = useResponsiveStyles();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
            router.replace('/auth/login');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleSettingsPress = () => {
    // TODO: Navigate to settings screen
    Alert.alert('Settings', 'Settings screen coming soon!');
  };

  const handleNotificationsPress = () => {
    // TODO: Navigate to notifications settings
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handlePrivacyPress = () => {
    // TODO: Navigate to privacy settings
    Alert.alert('Privacy', 'Privacy settings coming soon!');
  };

  const handleHelpPress = () => {
    // TODO: Navigate to help screen
    Alert.alert('Help', 'Help center coming soon!');
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={[styles.errorText, text.size('body')]}>
            Please log in to view your profile
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={!touchFirst}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.title, text.size('title'), text.weight('bold')]}>
            Profile
          </ThemedText>
        </View>

        {/* User Info Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.colors.card,
              borderRadius: radius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View style={styles.userInfo}>
            <View
              style={[
                styles.userAvatar,
                {
                  backgroundColor: theme.colors.tint,
                  borderRadius: radius.full,
                },
              ]}
            >
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText
                style={[styles.userName, text.size('heading'), text.weight('semibold')]}
              >
                {user.email?.split('@')[0] || 'User'}
              </ThemedText>
              <ThemedText style={[styles.userEmail, text.size('body')]}>
                {user.email}
              </ThemedText>
              <ThemedText style={[styles.userRole, text.size('caption')]}>
                {user.role || 'User'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <ThemedText
            style={[
              styles.sectionTitle,
              text.size('heading'),
              text.weight('semibold'),
              { marginBottom: spacing.sm },
            ]}
          >
            Settings
          </ThemedText>

          <ProfileItem
            icon={<Settings />}
            title="General Settings"
            description="App preferences and display options"
            onPress={handleSettingsPress}
          />

          <ProfileItem
            icon={<Bell />}
            title="Notifications"
            description="Manage notification preferences"
            onPress={handleNotificationsPress}
          />

          <ProfileItem
            icon={<Shield />}
            title="Privacy & Security"
            description="Account security and privacy settings"
            onPress={handlePrivacyPress}
          />

          <ProfileItem
            icon={colorScheme === 'dark' ? <Sun /> : <Moon />}
            title={colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            description={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`}
            onPress={toggleTheme}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <ThemedText
            style={[
              styles.sectionTitle,
              text.size('heading'),
              text.weight('semibold'),
              { marginBottom: spacing.sm },
            ]}
          >
            Support
          </ThemedText>

          <ProfileItem
            icon={<HelpCircle />}
            title="Help & Support"
            description="Get help and contact support"
            onPress={handleHelpPress}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ProfileItem
            icon={<LogOut />}
            title={isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            onPress={handleLogout}
            showChevron={false}
            isDestructive={true}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  userCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  profileItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileItemDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
  },
});
