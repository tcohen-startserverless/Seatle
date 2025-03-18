import { StyleSheet, View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { StudentSchemas } from '@core/student/schema';

interface StudentFormProps {
  onSubmit: (values: StudentSchemas.Types.CreateInput) => void;
  isSubmitting?: boolean;
}

export function StudentForm({ onSubmit, isSubmitting }: StudentFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      // onChange: StudentSchemas.CreateInput,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <View style={styles.form}>
      <View style={styles.fields}>
        <form.Field
          name="firstName"
          children={(field) => (
            <ThemedInput
              label="First Name"
              onChangeText={field.handleChange}
              value={field.state.value}
              error={field.state.meta.errors[0]?.message}
              editable={!isSubmitting}
            />
          )}
        />

        <form.Field
          name="lastName"
          children={(field) => (
            <ThemedInput
              label="Last Name"
              onChangeText={field.handleChange}
              value={field.state.value}
              error={field.state.meta.errors[0]?.message}
              editable={!isSubmitting}
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <form.Subscribe
          selector={(state) => [state.canSubmit]}
          children={([canSubmit]) => (
            <ThemedButton
              onPress={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Student'}
            </ThemedButton>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    width: '100%',
  },
  fields: {
    gap: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
