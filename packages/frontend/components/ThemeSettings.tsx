import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeManager } from '../theme/hooks';
import { useTheme } from '../theme/context';

interface ThemeOptionProps {
  label: string;
  value: 'light' | 'dark' | 'auto';
  selected: boolean;
  onSelect: () => void;
  description?: string;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  label,
  value,
  selected,
  onSelect,
  description,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.md,
        backgroundColor: selected ? `${theme.colors.tint}15` : 'transparent',
        borderWidth: 1,
        borderColor: selected ? theme.colors.tint : theme.colors.border,
      }}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label} theme ${description ? `: ${description}` : ''}`}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? theme.colors.tint : theme.colors.border,
          marginRight: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.colors.tint,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: selected ? '600' : '400',
            color: selected ? theme.colors.tint : theme.colors.text,
          }}
        >
          {label}
        </ThemedText>
        {description && (
          <ThemedText
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.icon,
              marginTop: 2,
            }}
          >
            {description}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface ThemeSettingsProps {
  showTitle?: boolean;
  compact?: boolean;
  onThemeChange?: (theme: 'light' | 'dark' | 'auto') => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  showTitle = true,
  compact = false,
  onThemeChange,
}) => {
  const {
    colorScheme,
    setColorScheme,
    toggleTheme,
    setAutoTheme,
    isManualOverride,
    isLoading,
  } = useThemeManager();
  const { theme } = useTheme();

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'auto') => {
    setColorScheme(selectedTheme);
    onThemeChange?.(selectedTheme);
  };

  const getCurrentSelection = (): 'light' | 'dark' | 'auto' => {
    if (isManualOverride) {
      return colorScheme === 'light' ? 'light' : 'dark';
    }
    return 'auto';
  };

  if (isLoading) {
    return (
      <ThemedView
        style={{
          padding: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="small" color={theme.colors.tint} />
        <ThemedText
          style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.icon,
          }}
        >
          Loading theme settings...
        </ThemedText>
      </ThemedView>
    );
  }

  if (compact) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
          accessibilityLabel={`Switch to ${colorScheme === 'light' ? 'dark' : 'light'} theme`}
        >
          <ThemedText
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: '500',
            }}
          >
            {colorScheme === 'light' ? '🌙' : '☀️'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const currentSelection = getCurrentSelection();

  return (
    <ThemedView
      style={{
        padding: theme.spacing.md,
      }}
    >
      {showTitle && (
        <ThemedText
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: '600',
            marginBottom: theme.spacing.lg,
          }}
        >
          Appearance
        </ThemedText>
      )}

      <View style={{ gap: theme.spacing.md }}>
        <ThemeOption
          label="Light"
          value="light"
          selected={currentSelection === 'light'}
          onSelect={() => handleThemeSelect('light')}
          description="Always use light theme"
        />

        <ThemeOption
          label="Dark"
          value="dark"
          selected={currentSelection === 'dark'}
          onSelect={() => handleThemeSelect('dark')}
          description="Always use dark theme"
        />

        <ThemeOption
          label="Automatic"
          value="auto"
          selected={currentSelection === 'auto'}
          onSelect={() => handleThemeSelect('auto')}
          description="Match your system settings"
        />
      </View>

      {currentSelection !== 'auto' && (
        <View
          style={{
            marginTop: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: `${theme.colors.info}10`,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: `${theme.colors.info}20`,
          }}
        >
          <ThemedText
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.info,
              textAlign: 'center',
            }}
          >
            You're using a manual theme override. Tap "Automatic" to follow your system
            settings.
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
};
