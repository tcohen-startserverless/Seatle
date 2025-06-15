import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { ProfileMenu } from '@/components/ProfileMenu';
import { User } from 'lucide-react';
import { useThemeColor, useSpacing, useTypography } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const spacing = useSpacing();
  const typography = useTypography();
  const iconColor = useThemeColor({}, 'text');
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.md,
          paddingLeft: insets.left + spacing.md,
          paddingRight: insets.right + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      <View style={[styles.header, { marginBottom: spacing.lg }]}>
        <ThemedText type="title">Home</ThemedText>

        <Pressable
          style={[styles.profileButton, { padding: spacing.sm }]}
          onPress={() => setShowMenu(!showMenu)}
        >
          <User size={24} color={iconColor} />
        </Pressable>
      </View>

      {showMenu && (
        <View
          style={[
            styles.menuContainer,
            {
              top: spacing['3xl'],
              right: insets.right + spacing.md,
            },
          ]}
        >
          <ProfileMenu />
        </View>
      )}

      <View style={[styles.content, { paddingTop: spacing.md }]}>
        <ThemedText
          style={[
            styles.welcomeText,
            {
              fontSize: typography.fontSize.lg,
              marginBottom: spacing.lg,
            },
          ]}
        >
          Welcome, {user?.email?.split('@')[0] || 'User'}!
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileButton: {},
  menuContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  content: {
    flex: 1,
  },
  welcomeText: {},
});
