import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const ChannelCreateScreen: React.FC<any> = ({ navigation }) => {
  return (
    <ScreenWrapper withKeyboardAvoidView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Channel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>How you'll appear</Text>
        
        {/* Banner Upload */}
        <TouchableOpacity style={styles.bannerUpload} activeOpacity={0.8}>
          <Ionicons name="image-outline" size={32} color={colors.dark.textSecondary} />
          <Text style={styles.uploadText}>Upload Banner</Text>
        </TouchableOpacity>

        {/* Profile Avatar Upload */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity style={styles.avatarUpload} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={28} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <InputField
            label="Channel Name"
            placeholder="e.g. My Awesome Channel"
          />
          <InputField
            label="Handle"
            placeholder="@myawesomechannel"
          />
          <InputField
            label="Description"
            placeholder="Tell viewers about your channel"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Text style={styles.disclaimer}>
            By tapping Create Channel you agree to VidPlay's Terms of Service.
          </Text>

          <Button
            title="Create Channel"
            onPress={() => navigation.navigate('ChannelDashboard')}
            style={styles.createBtn}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  content: {
    paddingBottom: layout.spacing.xl,
  },
  subtitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    margin: layout.spacing.md,
  },
  bannerUpload: {
    width: '100%',
    height: 120,
    backgroundColor: colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 4,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -40, // overlap with banner
    marginBottom: layout.spacing.xl,
  },
  avatarUpload: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dark.surface,
    borderWidth: 4,
    borderColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: layout.spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  disclaimer: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  createBtn: {
    width: '100%',
  },
});
