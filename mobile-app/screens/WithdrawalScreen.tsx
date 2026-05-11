import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { creatorService } from '../services/creatorService';
import { useAuth } from '../context/AuthContext';

const MINIMUM_WITHDRAWAL = 5000;

export const WithdrawalScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  
  // Form state
  const [withdrawalMethod, setWithdrawalMethod] = useState<'upi' | 'bank'>('upi');
  const [amount, setAmount] = useState('');
  const [upi, setUpi] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState('');

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, payoutsData] = await Promise.all([
        creatorService.getStats(),
        creatorService.getPayouts(),
      ]);
      setStats(statsData);
      setPayouts(payoutsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithdrawal = async () => {
    // Validate amount
    if (!amount) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountNum < MINIMUM_WITHDRAWAL) {
      Alert.alert('Error', `Minimum withdrawal amount is ₹${MINIMUM_WITHDRAWAL}`);
      return;
    }

    if (amountNum > (stats?.stats?.totalEarnings || 0)) {
      Alert.alert('Error', 'Insufficient earnings for this amount');
      return;
    }

    // Validate method-specific details
    if (withdrawalMethod === 'upi') {
      if (!upi.trim()) {
        Alert.alert('Error', 'Please enter UPI ID');
        return;
      }
      if (!upi.includes('@')) {
        Alert.alert('Error', 'Please enter a valid UPI ID');
        return;
      }
    } else {
      if (!bankDetails.accountHolder.trim()) {
        Alert.alert('Error', 'Please enter account holder name');
        return;
      }
      if (!bankDetails.accountNumber.trim()) {
        Alert.alert('Error', 'Please enter account number');
        return;
      }
      if (!bankDetails.ifsc.trim()) {
        Alert.alert('Error', 'Please enter IFSC code');
        return;
      }
      if (!bankDetails.bankName.trim()) {
        Alert.alert('Error', 'Please enter bank name');
        return;
      }
    }

    setSubmitting(true);
    try {
      const withdrawalData = {
        amount: amountNum,
        method: withdrawalMethod,
        details: withdrawalMethod === 'upi'
          ? { upi }
          : bankDetails,
        note,
      };

      const response = await creatorService.createWithdrawal(withdrawalData);

      Alert.alert('Success', response.message || 'Withdrawal request submitted successfully');
      
      // Reset form
      setAmount('');
      setUpi('');
      setNote('');
      setBankDetails({
        accountHolder: '',
        accountNumber: '',
        ifsc: '',
        bankName: '',
      });
      setShowWithdrawalForm(false);
      
      // Refresh data
      fetchData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit withdrawal request';
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.dark.primary;
      case 'approved':
        return '#FFA500';
      case 'paid':
        return '#4CAF50';
      case 'rejected':
        return '#FF6B6B';
      default:
        return colors.dark.textSecondary;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings & Withdrawals</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Ionicons name="wallet" size={32} color={colors.dark.primary} />
            <Text style={styles.earningsLabel}>Total Earnings</Text>
          </View>
          <Text style={styles.earningsAmount}>₹{(stats?.stats?.totalEarnings || 0).toLocaleString('en-IN')}</Text>
          <Text style={styles.earningsSubtext}>Available for withdrawal</Text>

          {/* Minimum Requirement Alert */}
          {(stats?.stats?.totalEarnings || 0) < MINIMUM_WITHDRAWAL && (
            <View style={styles.warningBox}>
              <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
              <Text style={styles.warningText}>
                Minimum ₹{MINIMUM_WITHDRAWAL} required to withdraw (₹{MINIMUM_WITHDRAWAL - (stats?.stats?.totalEarnings || 0)} more needed)
              </Text>
            </View>
          )}
        </View>

        {/* Withdrawal Button */}
        {(stats?.stats?.totalEarnings || 0) >= MINIMUM_WITHDRAWAL && (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawalForm(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={20} color={colors.dark.white} />
            <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
          </TouchableOpacity>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="videocam-outline"
            label="Total Videos"
            value={stats?.stats?.totalVideos || 0}
          />
          <StatCard
            icon="eye-outline"
            label="Total Views"
            value={(stats?.stats?.totalViews || 0).toLocaleString('en-IN', { notation: 'compact' })}
          />
          <StatCard
            icon="people-outline"
            label="Subscribers"
            value={(stats?.stats?.subscriberCount || 0).toLocaleString('en-IN', { notation: 'compact' })}
          />
        </View>

        {/* Withdrawal History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdrawal History</Text>

          {payouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={colors.dark.textSecondary} />
              <Text style={styles.emptyStateText}>No withdrawals yet</Text>
            </View>
          ) : (
            <View style={styles.withdrawalsList}>
              {payouts.map((payout: any) => (
                <View key={payout._id} style={styles.withdrawalItem}>
                  <View style={styles.withdrawalInfo}>
                    <View style={styles.withdrawalAmountRow}>
                      <Text style={styles.withdrawalAmount}>
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(payout.status) + '20', borderColor: getStatusColor(payout.status) },
                        ]}
                      >
                        <Text style={[styles.statusText, { color: getStatusColor(payout.status) }]}>
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.withdrawalDate}>{formatDate(payout.createdAt)}</Text>
                    <Text style={styles.withdrawalMethod}>
                      {payout.method === 'upi' ? 'UPI' : 'Bank Transfer'} • {payout.details?.upi || payout.details?.accountNumber?.slice(-4)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Withdrawal Form Modal */}
      <Modal
        visible={showWithdrawalForm}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWithdrawalForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Withdrawal</Text>
              <TouchableOpacity onPress={() => setShowWithdrawalForm(false)}>
                <Ionicons name="close" size={24} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              {/* Amount Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Withdrawal Amount *</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.dark.textSecondary}
                    keyboardType="number-pad"
                    value={amount}
                    onChangeText={setAmount}
                    editable={!submitting}
                  />
                </View>
                {amount && parseFloat(amount) < MINIMUM_WITHDRAWAL && (
                  <Text style={styles.helperText}>
                    Minimum amount is ₹{MINIMUM_WITHDRAWAL}
                  </Text>
                )}
              </View>

              {/* Withdrawal Method */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Withdrawal Method *</Text>
                <View style={styles.methodButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      withdrawalMethod === 'upi' && styles.methodButtonActive,
                    ]}
                    onPress={() => setWithdrawalMethod('upi')}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={20}
                      color={withdrawalMethod === 'upi' ? colors.dark.primary : colors.dark.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        withdrawalMethod === 'upi' && styles.methodButtonTextActive,
                      ]}
                    >
                      UPI
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      withdrawalMethod === 'bank' && styles.methodButtonActive,
                    ]}
                    onPress={() => setWithdrawalMethod('bank')}
                  >
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={withdrawalMethod === 'bank' ? colors.dark.primary : colors.dark.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodButtonText,
                        withdrawalMethod === 'bank' && styles.methodButtonTextActive,
                      ]}
                    >
                      Bank
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Method-specific fields */}
              {withdrawalMethod === 'upi' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>UPI ID *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="example@upi"
                    placeholderTextColor={colors.dark.textSecondary}
                    value={upi}
                    onChangeText={setUpi}
                    editable={!submitting}
                  />
                </View>
              ) : (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Account Holder Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Your name"
                      placeholderTextColor={colors.dark.textSecondary}
                      value={bankDetails.accountHolder}
                      onChangeText={(text) =>
                        setBankDetails({ ...bankDetails, accountHolder: text })
                      }
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Account Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Account number"
                      placeholderTextColor={colors.dark.textSecondary}
                      value={bankDetails.accountNumber}
                      onChangeText={(text) =>
                        setBankDetails({ ...bankDetails, accountNumber: text })
                      }
                      keyboardType="number-pad"
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>IFSC Code *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="IFSC code"
                      placeholderTextColor={colors.dark.textSecondary}
                      value={bankDetails.ifsc}
                      onChangeText={(text) =>
                        setBankDetails({ ...bankDetails, ifsc: text.toUpperCase() })
                      }
                      editable={!submitting}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Bank Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Bank name"
                      placeholderTextColor={colors.dark.textSecondary}
                      value={bankDetails.bankName}
                      onChangeText={(text) =>
                        setBankDetails({ ...bankDetails, bankName: text })
                      }
                      editable={!submitting}
                    />
                  </View>
                </>
              )}

              {/* Optional Note */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add any notes..."
                  placeholderTextColor={colors.dark.textSecondary}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={3}
                  editable={!submitting}
                />
              </View>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={colors.dark.primary} />
                <Text style={styles.infoText}>
                  Withdrawals are processed within 7 business days. You'll receive email updates on the status.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowWithdrawalForm(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitWithdrawal}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.dark.white} />
                ) : (
                  <>
                    <Ionicons name="arrow-up" size={18} color={colors.dark.white} />
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon as any} size={24} color={colors.dark.primary} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: layout.spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  earningsCard: {
    marginHorizontal: layout.spacing.md,
    marginTop: layout.spacing.lg,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.primary,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  earningsLabel: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginLeft: layout.spacing.sm,
  },
  earningsAmount: {
    color: colors.dark.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    marginVertical: layout.spacing.xs,
  },
  earningsSubtext: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  warningBox: {
    marginTop: layout.spacing.md,
    backgroundColor: '#FF6B6B20',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    padding: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  warningText: {
    color: '#FF6B6B',
    fontSize: typography.sizes.xs,
    flex: 1,
  },
  withdrawButton: {
    marginHorizontal: layout.spacing.md,
    marginTop: layout.spacing.lg,
    backgroundColor: colors.dark.primary,
    borderRadius: layout.borderRadius.full,
    paddingVertical: layout.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: layout.spacing.sm,
  },
  withdrawButtonText: {
    color: colors.dark.white,
    fontWeight: typography.weights.bold as '700',
    fontSize: typography.sizes.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: layout.spacing.lg,
    marginHorizontal: layout.spacing.md,
    gap: layout.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginTop: layout.spacing.xs,
  },
  statValue: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
    marginTop: layout.spacing.xs,
  },
  section: {
    marginTop: layout.spacing.xl,
    marginHorizontal: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: layout.spacing.xl,
  },
  emptyStateText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: layout.spacing.sm,
  },
  withdrawalsList: {
    gap: layout.spacing.md,
  },
  withdrawalItem: {
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
  },
  withdrawalInfo: {
    gap: layout.spacing.sm,
  },
  withdrawalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawalAmount: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  statusBadge: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold as '700',
  },
  withdrawalDate: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  withdrawalMethod: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.dark.background,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  modalTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  modalScroll: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.lg,
  },
  formGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    color: colors.dark.text,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.xs,
    fontSize: typography.sizes.sm,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    backgroundColor: colors.dark.surface,
  },
  currencySymbol: {
    color: colors.dark.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    marginRight: layout.spacing.xs,
  },
  amountInput: {
    flex: 1,
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    paddingVertical: layout.spacing.md,
    fontWeight: typography.weights.bold as '700',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    color: colors.dark.text,
    backgroundColor: colors.dark.surface,
    fontSize: typography.sizes.sm,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  helperText: {
    color: '#FF6B6B',
    fontSize: typography.sizes.xs,
    marginTop: layout.spacing.xs,
  },
  methodButtonsRow: {
    flexDirection: 'row',
    gap: layout.spacing.md,
  },
  methodButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: layout.borderRadius.md,
    paddingVertical: layout.spacing.md,
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
  },
  methodButtonActive: {
    borderColor: colors.dark.primary,
    backgroundColor: colors.dark.primary + '20',
  },
  methodButtonText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: layout.spacing.xs,
  },
  methodButtonTextActive: {
    color: colors.dark.primary,
    fontWeight: typography.weights.bold as '700',
  },
  infoBox: {
    backgroundColor: colors.dark.primary + '20',
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.sm,
    marginTop: layout.spacing.lg,
  },
  infoText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.xs,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: layout.spacing.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: layout.borderRadius.full,
    paddingVertical: layout.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.dark.text,
    fontWeight: typography.weights.bold as '700',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.dark.primary,
    borderRadius: layout.borderRadius.full,
    paddingVertical: layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: layout.spacing.xs,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.dark.white,
    fontWeight: typography.weights.bold as '700',
  },
});
