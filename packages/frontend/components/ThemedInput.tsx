import { TextInput, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

interface ThemedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable?: boolean;
}

export function ThemedInput({
  label,
  value,
  onChangeText,
  error,
  editable = true,
}: ThemedInputProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = '#ff0000';

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            backgroundColor,
            borderColor: error ? errorColor : borderColor,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
      {error && (
        <ThemedText style={[styles.error, { color: errorColor }]}>{error}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: '100%',
  },
  error: {
    fontSize: 12,
  },
});
