import { StyleSheet, View, useWindowDimensions, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/hooks/useAuth';
import { useListLists } from '@/api/hooks/lists';
import { useCreateChart, useListCharts } from '@/api/hooks/charts';
import {  ExternalLink } from 'lucide-react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

const ChartsList = () => {
  const router = useRouter();
  const { data: chartsData, isLoading, error } = useListCharts();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={tintColor} />
        <ThemedText>Loading charts...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>Error loading charts</ThemedText>
      </View>
    );
  }

  if (!chartsData?.data || chartsData.data.length === 0) {
    return <ThemedText>No charts created yet</ThemedText>;
  }

  return (
    <View style={styles.chartsContainer}>
      {chartsData.data.map((chart) => (
        <Pressable
          key={chart.id}
          style={[styles.chartItem, { borderColor }]}
          onPress={() => router.push(`/charts/${chart.id}`)}
        >
          <View style={styles.chartItemContent}>
            <ThemedText style={styles.chartName}>{chart.name}</ThemedText>
            {chart.description && (
              <ThemedText numberOfLines={2} style={styles.chartDescription}>
                {chart.description}
              </ThemedText>
            )}
          </View>
          <ExternalLink size={18} color={tintColor} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  errorContainer: {
    padding: 16,
  },
  chartsContainer: {
    gap: 12,
    marginTop: 8,
  },
  chartItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartItemContent: {
    flex: 1,
    marginRight: 12,
  },
  chartName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  chartList: {
    marginBottom: 32,
  },
  formContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 32,
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    marginBottom: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  listItem: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  createButton: {
    marginTop: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default function ChartsScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(800, screenWidth - 32);
  const iconColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const { user } = useAuth();
  
  // Fetch available lists
  const { data: listsData } = useListLists();
  const createChartMutation = useCreateChart();
  
  const [selectedListId, setSelectedListId] = useState<string>('');
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.id) {
        Alert.alert('Error', 'You must be logged in to create a chart');
        return;
      }
      
      if (!value.name.trim()) {
        Alert.alert('Error', 'Please enter a chart name');
        return;
      }
      
      if (!selectedListId) {
        Alert.alert('Error', 'Please select a list');
        return;
      }
      
      try {
        // Create the chart
        const chart = await createChartMutation.mutateAsync({
          name: value.name.trim(),
          description: value.description?.trim() || undefined,
          userId: user.id,
          listId: selectedListId,
        });
        
        form.reset();
        setSelectedListId('');
        
        router.push(`/charts/${chart.id}`);
      } catch (error) {
        console.error('Error creating chart:', error);
        Alert.alert('Error', 'Failed to create chart');
      }
    },
  });
  
  const isSubmitting = createChartMutation.isPending || form.state.isSubmitting;
  
  const selectList = (listId: string) => {
    setSelectedListId(listId);
  };
  
  // Render list selection options
  const renderListOptions = () => {
    if (!listsData?.data || listsData.data.length === 0) {
      return <ThemedText>No lists available</ThemedText>;
    }

    return (
      <View style={styles.listContainer}>
        {listsData.data.map((list) => {
          const isSelected = selectedListId === list.id;
          return (
            <Pressable
              key={list.id}
              style={[
                styles.listItem,
                { 
                  borderColor,
                  backgroundColor: isSelected 
                    ? tintColor 
                    : 'transparent'
                },
              ]}
              onPress={() => selectList(list.id)}
            >
              <ThemedText
                style={isSelected ? { color: '#ffffff', fontWeight: 'bold' } : undefined}
              >
                {list.name}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { width: contentWidth }]}>
        <View style={styles.header}>
          <ThemedText type="title">Charts</ThemedText>
        </View>
        
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.chartList}>
            <ThemedText type="subtitle">Your Charts</ThemedText>
            <ChartsList />
          </View>
          
          {/* Chart creation form */}
          <View style={styles.formContainer}>
            <ThemedText type="subtitle">Create New Chart</ThemedText>
            
            <form.Field
              name="name"
            >
              {(field) => (
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Name</ThemedText>
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter chart name"
                    style={styles.input}
                  />
                  {field.state.meta.errors.length > 0 && field.state.meta.isTouched ? (
                    <ThemedText style={styles.errorText}>
                      {field.state.meta.errors[0]}
                    </ThemedText>
                  ) : null}
                </View>
              )}
            </form.Field>
            
            <form.Field
              name="description"
            >
              {(field) => (
                <View style={styles.formGroup}>
                  <ThemedText style={styles.label}>Description (optional)</ThemedText>
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter description"
                    style={styles.input}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              )}
            </form.Field>
            
            <ThemedText style={styles.sectionLabel}>Associated Lists</ThemedText>
            {renderListOptions()}
            
            <Button 
              onPress={() => form.handleSubmit()}
              disabled={!form.state.canSubmit || isSubmitting}
              isLoading={isSubmitting}
              style={styles.createButton}
            >
              Create Chart
            </Button>
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
}