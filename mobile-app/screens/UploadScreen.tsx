import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const UploadScreen: React.FC = () => {
  return (
    <ScreenWrapper withKeyboardAvoidView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Video</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Video Picker Placeholder */}
        <View style={styles.uploadPlaceholder}>
          <Ionicons name="cloud-upload-outline" size={64} color={colors.dark.textSecondary} />
          <Text style={styles.uploadText}>Tap to select a video</Text>
        </View>

        <InputField
          label="Title"
          placeholder="Create a title"
        />

        <InputField
          label="Description"
          placeholder="Add description"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <InputField
          label="Visibility"
          placeholder="Public"
        />

        <Button
          title="Upload Video"
          onPress={() => {}}
          style={styles.uploadBtn}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  content: {
    padding: layout.spacing.md,
  },
  uploadPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.md,
    marginTop: layout.spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    marginTop: layout.spacing.lg,
  },
});
