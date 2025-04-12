import { StyleSheet, View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { PersonSchema } from '@core/person';

type PersonFormProps = {
  onSubmit: (values: PersonSchema.Types.Create) => Promise<void>;
  initialValues?: Partial<PersonSchema.Types.Create>;
  listId: string;
  isSubmitting?: boolean;
  buttonText?: string;
};

export function PersonForm({
  onSubmit,
  initialValues,
  listId,
  isSubmitting = false,
  buttonText = 'Save',
}: PersonFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      email: initialValues?.email,
      phone: initialValues?.phone,
      notes: initialValues?.notes,
      listId: listId,
    },
    onSubmit: async ({ value }) => {
      try {
        const cleanedData: Partial<PersonSchema.Types.Create> = {
          firstName: value.firstName.trim(),
          lastName: value.lastName.trim(),
          listId: listId,
        };

        if (value.email && value.email.trim()) {
          cleanedData.email = value.email.trim();
        }

        if (value.phone && value.phone.trim()) {
          cleanedData.phone = value.phone.trim();
        }

        if (value.notes && value.notes.trim()) {
          cleanedData.notes = value.notes.trim();
        }

        await onSubmit(cleanedData as PersonSchema.Types.Create);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
  });

  return (
    <View style={styles.form}>
      <form.Field
        name="firstName"
        validators={{
          onChange: (field) => {
            if (!field.value?.trim()) {
              return 'First name is required';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter first name"
              style={styles.input}
              autoFocus
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
        name="lastName"
        validators={{
          onChange: (field) => {
            if (!field.value?.trim()) {
              return 'Last name is required';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter last name"
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
        name="email"
        validators={{
          onChange: (field) => {
            if (field.value && !field.value.includes('@')) {
              return 'Please enter a valid email';
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Email (optional)</ThemedText>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {field.state.meta.errors.length > 0 && field.state.meta.isTouched ? (
              <ThemedText style={styles.errorText}>
                {field.state.meta.errors[0]}
              </ThemedText>
            ) : null}
          </View>
        )}
      </form.Field>

      <form.Field name="phone">
        {(field) => (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Phone (optional)</ThemedText>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter phone number"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Notes (optional)</ThemedText>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter notes"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </View>
        )}
      </form.Field>

      <Button
        onPress={() => form.handleSubmit()}
        style={styles.button}
        isLoading={isSubmitting}
        disabled={!form.state.canSubmit}
      >
        {buttonText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
