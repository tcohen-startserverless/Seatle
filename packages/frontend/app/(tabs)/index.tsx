import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

import { Grid, List, Plus } from 'lucide-react';
import { useReactiveThemeColor, useSpacing, useTypography } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdaptiveDesign } from '@/hooks/useAdaptiveDesign';
import { useResponsiveStyles } from '@/hooks/useResponsiveStyles';
import { TouchTarget } from '@/components/adaptive/TouchTarget';

import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuthContext();
  const router = useRouter();

  const spacing = useSpacing();
  const iconColor = useReactiveThemeColor({}, 'text');
  const borderColor = useReactiveThemeColor({}, 'border');
  const insets = useSafeAreaInsets();
  const { touchFirst } = useAdaptiveDesign();
  const { text, size, layout, space } = useResponsiveStyles();

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          layout.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingLeft: Math.max(insets.left, spacing.md),
            paddingRight: Math.max(insets.right, spacing.md),
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        {/* Header with improved touch targets */}
        <View style={[styles.header, { marginBottom: spacing.xl }]}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              Home
            </ThemedText>
            <ThemedText
              style={[styles.subtitle, text.size('body'), { marginTop: spacing.xs }]}
            >
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </ThemedText>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActions,
            {
              gap: spacing.md,
              maxWidth: touchFirst ? '100%' : 400,
              alignSelf: 'center',
            },
          ]}
        >
          <TouchTarget
            onPress={() => router.push('/lists')}
            variant="primary"
            size={touchFirst ? 'large' : 'medium'}
            accessibilityLabel="Go to Lists"
            accessibilityRole="button"
            style={{
              ...styles.quickActionButton,
              ...(touchFirst ? { flex: 1 } : { minWidth: 180 }),
            }}
          >
            <List size={size.icon('action')} color="white" />
            <ThemedText style={styles.quickActionText}>Lists</ThemedText>
          </TouchTarget>

          <TouchTarget
            onPress={() => router.push('/charts')}
            variant="primary"
            size={touchFirst ? 'large' : 'medium'}
            accessibilityLabel="Go to Charts"
            accessibilityRole="button"
            style={{
              ...styles.quickActionButton,
              ...(touchFirst ? { flex: 1 } : { minWidth: 180 }),
            }}
          >
            <Grid size={size.icon('action')} color="white" />
            <ThemedText style={styles.quickActionText}>Charts</ThemedText>
          </TouchTarget>
        </View>

        {/* Recent Activity Section */}
        <View style={[styles.section, { marginTop: spacing.xl }]}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { marginBottom: spacing.md }]}
          >
            Recent Activity
          </ThemedText>
          <View style={[styles.placeholder, { padding: spacing.lg, borderColor }]}>
            <ThemedText style={styles.placeholderText}>
              Your recent lists and charts will appear here
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.7,
    fontWeight: '400',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickActionButton: {
    minHeight: 60,
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  placeholderText: {
    opacity: 0.5,
    textAlign: 'center',
    fontSize: 16,
  },
});
