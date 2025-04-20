# Seater Theme System

## Overview

The theming system provides a consistent way to apply styling across the app. It includes:

- Color palette management for light and dark modes
- Typography definitions (font sizes, weights, line heights)
- Spacing scale
- Border radius scale

## Getting Started

The app is already wrapped with `ThemeProvider` in the root layout, so you can use the theme hooks anywhere in your components.

## Usage

### Basic Usage

```tsx
import { useTheme } from '@/theme';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md
    }}>
      <Text style={{ 
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.md
      }}>
        Hello World
      </Text>
    </View>
  );
}
```

### Specialized Hooks

For specific theme properties, you can use specialized hooks:

```tsx
import { useThemeColor, useSpacing, useRadius, useTypography } from '@/theme';

function MyComponent() {
  // Get a specific color (maintains backward compatibility)
  const backgroundColor = useThemeColor({}, 'background');
  
  // Get spacing values
  const spacing = useSpacing();
  
  // Get radius values
  const radius = useRadius();
  
  // Get typography values
  const typography = useTypography();
  
  return (
    <View style={{ 
      backgroundColor, 
      padding: spacing.md,
      borderRadius: radius.md
    }}>
      <Text style={{ 
        fontSize: typography.fontSize.md,
        lineHeight: typography.lineHeight.md
      }}>
        Hello World
      </Text>
    </View>
  );
}
```

### Using with Themed Components

The existing `ThemedView` and `ThemedText` components continue to work with the new theme system:

```tsx
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText>This uses the theme colors automatically</ThemedText>
    </ThemedView>
  );
}
```

## Customizing the Theme

To modify the theme, edit the appropriate files:

- **Colors**: Update `theme/theme.ts` to change color values
- **Typography**: Update font families, sizes, or line heights in `theme/theme.ts`
- **Spacing**: Modify the spacing scale in `theme/theme.ts`
- **Border Radius**: Change radius values in `theme/theme.ts`

## Adding New Theme Properties

To extend the theme with new properties:

1. Add the new property type in `theme/types.ts`
2. Add the values in `theme/theme.ts` 
3. Create a new hook in `theme/hooks.ts` if needed
4. Export the new hook from `theme/index.ts`

## Best Practices

- Use theme properties instead of hardcoded values
- Keep your styles consistent by using the predefined scales
- For one-off variations, use component props rather than modifying the theme