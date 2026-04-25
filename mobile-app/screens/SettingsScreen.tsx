import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const SettingItem = ({ icon, title, subtitle, rightElement, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <Ionicons name={icon} size={24} color={colors.dark.text} style={styles.settingIcon} />
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem 
            icon="moon-outline" 
            title="Dark theme" 
            subtitle="Reduce glare and improve night viewing"
            rightElement={
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode} 
                trackColor={{ false: colors.dark.border, true: colors.dark.primary }}
              />
            }
          />
          <SettingItem 
            icon="notifications-outline" 
            title="Notifications" 
            subtitle="Manage app notifications"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem 
            icon="person-outline" 
            title="Account Management" 
            subtitle="Manage your account settings"
          />
          <SettingItem 
            icon="shield-checkmark-outline" 
            title="Privacy" 
            subtitle="Manage your data and privacy settings"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem 
            icon="information-circle-outline" 
            title="About VidPlay" 
            subtitle="Version 1.0.0"
          />
          <SettingItem 
            icon="document-text-outline" 
            title="Terms of Service" 
          />
        </View>
        
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingVertical: layout.spacing.md,
  },
  section: {
    marginBottom: layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    paddingBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
  },
  settingIcon: {
    marginRight: layout.spacing.lg,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: layout.spacing.sm,
  },
  settingTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  settingSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  logoutBtn: {
    padding: layout.spacing.md,
    alignItems: 'center',
    marginTop: layout.spacing.lg,
  },
  logoutText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
  },
});
