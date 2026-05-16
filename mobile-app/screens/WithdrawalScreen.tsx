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
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { creatorService } from '../services/creatorService';
import { useAuth } from '../context/AuthContext';
import { formatViews } from '../utils/videoUtils';

const { width } = Dimensions.get('window');
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

    const totalEarnings = stats?.stats?.totalEarnings || 0;
    if (amountNum > totalEarnings) {
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
      case 'pending': return '#2979FF';
      case 'approved': return '#FF9100';
      case 'paid': return '#00E676';
      case 'rejected': return '#FF5252';
      default: return colors.dark.textSecondary;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalEarnings = stats?.stats?.totalEarnings || 0;
  const progress = Math.min(totalEarnings / MINIMUM_WITHDRAWAL, 1);
  const remaining = Math.max(MINIMUM_WITHDRAWAL - totalEarnings, 0);

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
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.container}
        stickyHeaderIndices={[0]}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings & Payments</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Premium Earnings Card */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={['#1A237E', '#283593', '#3949AB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.earningsCard}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardLabel}>Available Balance</Text>
                <Text style={styles.earningsAmount}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.walletIconBg}>
                <Ionicons name="wallet" size={28} color="white" />
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              </View>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressText}>
                  {progress < 1 ? `₹${totalEarnings.toLocaleString('en-IN')} of ₹${MINIMUM_WITHDRAWAL.toLocaleString('en-IN')}` : 'Threshold Reached'}
                </Text>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
              </View>
            </View>

            {progress < 1 ? (
              <View style={styles.remainingInfo}>
                <Ionicons name="information-circle" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.remainingText}>
                  You need ₹{remaining.toLocaleString('en-IN')} more to request a payout.
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.withdrawButtonHero}
                onPress={() => setShowWithdrawalForm(true)}
                activeOpacity={0.9}
              >
                <Text style={styles.withdrawButtonHeroText}>Withdraw Now</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.dark.primary} />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Sources</Text>
          <View style={styles.breakdownGrid}>
            <BreakdownItem 
              label="Video Ads" 
              amount={Math.round(totalEarnings * 0.7)} 
              icon="play-circle" 
              color="#FF5252"
            />
            <BreakdownItem 
              label="Shorts Rewards" 
              amount={Math.round(totalEarnings * 0.2)} 
              icon="flash" 
              color="#FFD740"
            />
            <BreakdownItem 
              label="Premium Views" 
              amount={Math.round(totalEarnings * 0.1)} 
              icon="star" 
              color="#2979FF"
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Channel Performance</Text>
          <View style={styles.statsRow}>
            <GlassStatCard
              icon="eye-outline"
              label="Total Views"
              value={formatViews(stats?.stats?.totalViews || 0)}
              trend="+12%"
            />
            <GlassStatCard
              icon="people-outline"
              label="Subscribers"
              value={formatViews(stats?.stats?.subscriberCount || 0)}
              trend="+8%"
            />
          </View>
        </View>

        {/* Withdrawal History */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
            {payouts.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {payouts.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={32} color={colors.dark.textSecondary} />
              </View>
              <Text style={styles.emptyStateText}>No payout history found</Text>
              <Text style={styles.emptyStateSubtext}>Your payments will appear here once requested.</Text>
            </View>
          ) : (
            <View style={styles.withdrawalsList}>
              {payouts.map((payout: any) => (
                <View key={payout._id} style={styles.payoutItem}>
                  <View style={styles.payoutIconBox}>
                    <Ionicons 
                      name={payout.method === 'upi' ? "phone-portrait-outline" : "business-outline"} 
                      size={20} 
                      color={colors.dark.text} 
                    />
                  </View>
                  <View style={styles.payoutMainInfo}>
                    <Text style={styles.payoutAmount}>₹{payout.amount.toLocaleString('en-IN')}</Text>
                    <Text style={styles.payoutDate}>{formatDate(payout.createdAt)}</Text>
                  </View>
                  <View style={styles.payoutStatusSide}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payout.status) + '20', borderColor: getStatusColor(payout.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(payout.status) }]}>
                        {payout.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.payoutMethod}>
                      {payout.method === 'upi' ? 'UPI' : 'BANK'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Payment Guide</Text>
          <HelpItem 
            icon="time-outline" 
            title="Processing Time" 
            desc="Withdrawals are usually processed within 5-7 working days." 
          />
          <HelpItem 
            icon="shield-checkmark-outline" 
            title="Secure Payments" 
            desc="All transactions are encrypted and processed via verified gateways." 
          />
          <HelpItem 
            icon="help-buoy-outline" 
            title="Need Help?" 
            desc="Contact creator support if you face any issues with payouts." 
          />
        </View>
      </ScrollView>

      {/* Modern Withdrawal Form Modal */}
      <Modal
        visible={showWithdrawalForm}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWithdrawalForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdrawalForm(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              <View style={styles.availableBox}>
                <Text style={styles.availableLabel}>Available to withdraw</Text>
                <Text style={styles.availableValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount to Withdraw</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="number-pad"
                    value={amount}
                    onChangeText={setAmount}
                    editable={!submitting}
                  />
                </View>
                {amount && parseFloat(amount) < MINIMUM_WITHDRAWAL && (
                  <Text style={styles.errorText}>Minimum ₹{MINIMUM_WITHDRAWAL} required</Text>
                )}
              </View>

              <Text style={styles.label}>Payout Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity 
                  style={[styles.methodOption, withdrawalMethod === 'upi' && styles.methodOptionActive]}
                  onPress={() => setWithdrawalMethod('upi')}
                >
                  <Ionicons name="phone-portrait-outline" size={24} color={withdrawalMethod === 'upi' ? colors.dark.primary : 'white'} />
                  <Text style={[styles.methodLabel, withdrawalMethod === 'upi' && styles.methodLabelActive]}>UPI</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.methodOption, withdrawalMethod === 'bank' && styles.methodOptionActive]}
                  onPress={() => setWithdrawalMethod('bank')}
                >
                  <Ionicons name="business-outline" size={24} color={withdrawalMethod === 'bank' ? colors.dark.primary : 'white'} />
                  <Text style={[styles.methodLabel, withdrawalMethod === 'bank' && styles.methodLabelActive]}>Bank</Text>
                </TouchableOpacity>
              </View>

              {withdrawalMethod === 'upi' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>UPI ID</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="username@upi"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={upi}
                    onChangeText={setUpi}
                    editable={!submitting}
                  />
                </View>
              ) : (
                <View style={styles.bankForm}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Account Holder Name"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={bankDetails.accountHolder}
                    onChangeText={(t) => setBankDetails({...bankDetails, accountHolder: t})}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Account Number"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="number-pad"
                    value={bankDetails.accountNumber}
                    onChangeText={(t) => setBankDetails({...bankDetails, accountNumber: t})}
                  />
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="IFSC Code"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      autoCapitalize="characters"
                      value={bankDetails.ifsc}
                      onChangeText={(t) => setBankDetails({...bankDetails, ifsc: t.toUpperCase()})}
                    />
                    <View style={{ width: 10 }} />
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Bank Name"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={bankDetails.bankName}
                      onChangeText={(t) => setBankDetails({...bankDetails, bankName: t})}
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, (submitting || !amount) && styles.submitButtonDisabled]}
                onPress={handleSubmitWithdrawal}
                disabled={submitting || !amount}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Request Payout</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const BreakdownItem = ({ label, amount, icon, color }: any) => (
  <View style={styles.breakdownCard}>
    <View style={[styles.breakdownIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.breakdownLabel}>{label}</Text>
    <Text style={styles.breakdownAmount}>₹{amount.toLocaleString('en-IN')}</Text>
  </View>
);

const GlassStatCard = ({ icon, label, value, trend }: any) => (
  <View style={styles.glassCard}>
    <View style={styles.glassHeader}>
      <Ionicons name={icon} size={18} color="rgba(255,255,255,0.6)" />
      <Text style={styles.trendText}>{trend}</Text>
    </View>
    <Text style={styles.glassValue}>{value}</Text>
    <Text style={styles.glassLabel}>{label}</Text>
  </View>
);

const HelpItem = ({ icon, title, desc }: any) => (
  <View style={styles.helpItem}>
    <View style={styles.helpIconCircle}>
      <Ionicons name={icon} size={20} color={colors.dark.primary} />
    </View>
    <View style={styles.helpContent}>
      <Text style={styles.helpTitle}>{title}</Text>
      <Text style={styles.helpDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 15, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    padding: 20,
  },
  earningsCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  earningsAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 4,
  },
  walletIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00E676',
    borderRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  remainingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  remainingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  withdrawButtonHero: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  withdrawButtonHeroText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  breakdownCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  breakdownAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  glassCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '800',
  },
  glassValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  glassLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  seeAllText: {
    color: colors.dark.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  withdrawalsList: {
    gap: 12,
    marginTop: 12,
  },
  payoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  payoutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  payoutMainInfo: {
    flex: 1,
  },
  payoutAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  payoutDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  payoutStatusSide: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  payoutMethod: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  helpSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  helpItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  helpIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  helpDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  availableBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  availableLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  availableValue: {
    color: colors.dark.primary,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 64,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  currencyPrefix: {
    color: colors.dark.primary,
    fontSize: 24,
    fontWeight: '900',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 60,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  methodOptionActive: {
    backgroundColor: colors.dark.primary + '15',
    borderColor: colors.dark.primary,
  },
  methodLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  methodLabelActive: {
    color: colors.dark.primary,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 56,
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  bankForm: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: colors.dark.primary,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#333',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
});
