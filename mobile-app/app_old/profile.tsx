import React from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import { getLocalizedStrings } from '@/utils/localization';

const strings = getLocalizedStrings();

const Profile = () => {
  const router = useRouter();
  const [receiveNotifications, setReceiveNotifications] = React.useState(true);

  const toggleNotifications = () =>
    setReceiveNotifications((previousState) => !previousState);

  const renderSettingItem = (icon: string, text: string, onPress?: () => void, isToggle?: boolean, toggleValue?: boolean, onToggleChange?: () => void) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress && !isToggle}>
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={COLORS.icon}
        />
        <Text style={styles.settingText}>{text}</Text>
      </View>
      {isToggle ? (
        <Switch
          trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.lightGray}
          onValueChange={onToggleChange}
          value={toggleValue}
        />
      ) : (
        <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.icon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={SIZES.h1 * 2} color={COLORS.gray} />
          <Text style={styles.headerTitle}>{strings.profileSettingsTitle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.generalSettings}</Text>


          {renderSettingItem(
            'bell',
            strings.notifications,
            undefined,
            true,
            receiveNotifications,
            toggleNotifications
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.about}</Text>
          {renderSettingItem('information', `${strings.version}: 1.0.0`)}
          {renderSettingItem('file-document', strings.privacyPolicy, () => Linking.openURL('https://rudnex.in/privacy-policy/'))}
          {renderSettingItem('handshake', strings.termsOfService, () => router.push('/terms'))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
    backgroundColor: COLORS.card,
    marginBottom: SIZES.padding,
    ...SHADOWS.small,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  section: {
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    ...SHADOWS.small,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.darkGray,
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...FONTS.body3,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
});

export default Profile;
