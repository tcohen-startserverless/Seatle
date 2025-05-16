import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useIsRestoring } from '@/api/QueryPersistenceProvider';
import { useThemeColor } from '@/theme';

/**
 * RestoreLoadingIndicator shows a loading indicator when the app
 * is restoring data from persisted storage.
 *
 * This can be placed strategically in the app to indicate to users
 * that cached data is being loaded.
 */
export default function RestoreLoadingIndicator() {
  const isRestoring = useIsRestoring();
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primaryRow');

  if (!isRestoring) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={primary} />
      <Text style={[styles.text, { color: text }]}>Loading cached data...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});
