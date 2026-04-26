import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '@/constants/theme';

const PrivacyPolicy = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.text}>
                    Welcome to PlayVia. We respect your privacy and are committed to protecting it. This privacy policy explains that we do not collect any personal data from our users.
                </Text>

                <Text style={styles.sectionTitle}>2. Data Collection</Text>
                <Text style={styles.text}>
                    We do not collect, store, or process any personal data, usage data, or tracking information. Your use of the PlayVia application is completely private.
                </Text>

                <Text style={styles.sectionTitle}>3. Advertising and Third-Party Services</Text>
                <Text style={styles.text}>
                    We use third-party advertising companies to serve ads when you visit our application. These companies may use information about your visits to this and other applications in order to provide advertisements about goods and services of interest to you.
                </Text>
                <Text style={styles.text}>
                    While PlayVia itself does not collect personal data, our advertising partners (such as Google AdMob) may collect non-personal data (like device ID, advertising ID) to show relevant ads. By using this app, you consent to this standard industry practice.
                </Text>

                <Text style={styles.sectionTitle}>4. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about this privacy policy, please contact us at: support@cinemia.com
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Last updated: December 2025</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: SIZES.base,
        marginRight: SIZES.base,
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.text,
        fontWeight: 'bold',
    },
    content: {
        padding: SIZES.padding,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.primary,
        marginBottom: SIZES.base,
        marginTop: SIZES.padding,
        fontWeight: 'bold',
    },
    text: {
        ...FONTS.body3,
        color: COLORS.text,
        marginBottom: SIZES.base,
        lineHeight: 22,
    },
    footer: {
        marginTop: SIZES.padding * 2,
        marginBottom: SIZES.padding,
        alignItems: 'center',
    },
    footerText: {
        ...FONTS.body4,
        color: COLORS.gray,
    }
});

export default PrivacyPolicy;
