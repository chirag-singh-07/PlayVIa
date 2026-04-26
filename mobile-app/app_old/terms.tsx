import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '@/constants/theme';

const TermsOfService = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.text}>
                    By accessing and using the PlayVia application, you accept and agree to be bound by the terms and provision of this agreement.
                </Text>

                <Text style={styles.sectionTitle}>2. Use License</Text>
                <Text style={styles.text}>
                    Permission is granted to temporarily download one copy of the materials (information or software) on PlayVia for personal, non-commercial transitory viewing only.
                </Text>

                <Text style={styles.sectionTitle}>3. Disclaimer</Text>
                <Text style={styles.text}>
                    The materials on PlayVia are provided "as is". PlayVia makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </Text>

                <Text style={styles.sectionTitle}>4. Limitations</Text>
                <Text style={styles.text}>
                    In no event shall PlayVia or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PlayVia.
                </Text>

                <Text style={styles.sectionTitle}>5. Governing Law</Text>
                <Text style={styles.text}>
                    Any claim relating to PlayVia shall be governed by the laws of the local jurisdiction without regard to its conflict of law provisions.
                </Text>

                <Text style={styles.sectionTitle}>6. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about these Terms, please contact us at: support@cinemia.com
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

export default TermsOfService;
