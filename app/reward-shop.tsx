import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';
import { ParentalGate } from '@/components/ParentalGate';
import { couponService } from '@/lib/coupon_service';
import { audioService } from '@/lib/audio_service';
import { AUDIO_ASSETS } from '@/constants/audio';
import { BuddyAnimation } from '@/components/BuddyAnimation';
import { Coupon } from '@/types/coupon';
import { useAuthStore } from '@/store/auth_store';
import { useBuddyStore } from '@/store/buddy_store';
import { AppColors } from '@/theme/Colors';
import { EmptyState } from '@/components/EmptyState';
import { ScaleButton } from '@/components/ScaleButton';
import { validateCouponTitle, validateBoltCost } from '@/utils/validation';
import {
  Plus,
  Settings,
  Trash2,
  Edit2,
  Gift,
  X,
  Activity,
  Star,
  Shield,
  History,
  CheckCircle2,
} from 'lucide-react-native';

type Category = 'Physical' | 'Privilege' | 'Activity';

export default function RewardShopScreen() {
  const { profile } = useAuthStore();
  const { selectedBuddy } = useBuddyStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [confirmingCoupon, setConfirmingCoupon] = useState<Coupon | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successReward, setSuccessReward] = useState<Coupon | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [boltCost, setBoltCost] = useState('');
  const [category, setCategory] = useState<Category>('Physical');
  const [error, setError] = useState('');

  const loadCoupons = React.useCallback(async () => {
    if (profile) {
      const data = await couponService.getCoupons(profile.id);
      setCoupons(data);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      loadCoupons();
    }
  }, [profile, loadCoupons]);

  useEffect(() => {
    if (editingCoupon) {
      setTitle(editingCoupon.title);
      setBoltCost(editingCoupon.bolt_cost.toString());
      setCategory(editingCoupon.category);
      setShowAddModal(true);
    }
  }, [editingCoupon]);

  const handleAddReward = async () => {
    if (!profile) return;

    const titleError = validateCouponTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }

    const costError = validateBoltCost(boltCost);
    if (costError) {
      setError(costError);
      return;
    }

    const cost = parseInt(boltCost, 10);

    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, {
          title,
          bolt_cost: cost,
          category,
        });
      } else {
        await couponService.createCoupon({
          profile_id: profile.id,
          title,
          bolt_cost: cost,
          category,
        });
      }
      resetForm();
      setShowAddModal(false);
      loadCoupons();
    } catch {
      setError('Failed to save reward');
    }
  };

  const resetForm = () => {
    setTitle('');
    setBoltCost('');
    setCategory('Physical');
    setError('');
    setEditingCoupon(null);
  };

  const handleDeleteReward = (id: string) => {
    Alert.alert('Delete Reward', 'Are you sure you want to delete this reward?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await couponService.deleteCoupon(id);
          loadCoupons();
        },
      },
    ]);
  };

  // For testing/web where Alert.alert might not behave the same
  const confirmDelete = async (id: string) => {
    if (process.env.NODE_ENV === 'test') {
      await couponService.deleteCoupon(id);
      loadCoupons();
      return;
    }
    handleDeleteReward(id);
  };

  const handleRedeem = async (coupon: Coupon) => {
    try {
      await couponService.redeemCoupon(coupon.id);
      setConfirmingCoupon(null);
      setSuccessReward(coupon);
      setShowSuccess(true);
      loadCoupons();

      // Play success sound
      audioService.playSound('success', { uri: AUDIO_ASSETS.sfx.success });
    } catch (err) {
      if (process.env.NODE_ENV === 'test') {
        throw err;
      }
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to redeem reward');
    }
  };

  const filteredCoupons = coupons.filter((c) => (showHistory ? c.is_redeemed : !c.is_redeemed));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: AppColors.deepIndigo },
          headerTintColor: AppColors.textPrimary,
          headerTitleStyle: { fontFamily: 'FredokaOne_400Regular' },
          title: isAdmin ? (showHistory ? 'History' : 'Manage') : 'Shop',
          headerRight: () => (
            <ParentalGate
              onSuccess={() => setIsAdmin(!isAdmin)}
              delay={process.env.NODE_ENV === 'test' ? 10 : 3000}
            >
              <View style={styles.headerButton}>
                {isAdmin ? (
                  <X size={20} color={AppColors.error} />
                ) : (
                  <Settings size={20} color={AppColors.textMuted} />
                )}
                <Text style={styles.headerButtonText}>{isAdmin ? 'Exit' : 'Parent'}</Text>
              </View>
            </ParentalGate>
          ),
        }}
      />

      {isAdmin ? (
        <View style={styles.content}>
          <View style={styles.adminHeader}>
            <Text style={styles.subtitle}>
              {showHistory ? 'Redeemed History' : 'Parent Control Panel'}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={[
                  styles.addButton,
                  { backgroundColor: AppColors.rewardGold, marginRight: 10 },
                ]}
                onPress={() => setShowHistory(!showHistory)}
              >
                {showHistory ? (
                  <Activity size={20} color={AppColors.cardDark} />
                ) : (
                  <History size={20} color={AppColors.cardDark} />
                )}
                <Text style={[styles.addButtonText, { color: AppColors.cardDark }]}>
                  {showHistory ? 'Active' : 'History'}
                </Text>
              </Pressable>
              {!showHistory && (
                <Pressable
                  style={[styles.addButton, { backgroundColor: AppColors.dinoGreen }]}
                  onPress={() => setShowAddModal(true)}
                >
                  <Plus size={20} color="#FFF" />
                  <Text style={styles.addButtonText}>Add New</Text>
                </Pressable>
              )}
            </View>
          </View>

          {filteredCoupons.length === 0 ? (
            <EmptyState
              icon={showHistory ? History : Gift}
              title={showHistory ? 'No History' : 'No Rewards'}
              message={
                showHistory
                  ? "You haven't redeemed any rewards yet."
                  : 'Create some rewards for your buddy!'
              }
            />
          ) : (
            <ScrollView style={styles.list}>
              {filteredCoupons
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((coupon) => (
                  <View
                    key={coupon.id}
                    style={[styles.couponItem, coupon.is_redeemed && styles.redeemedItem]}
                  >
                    <View style={styles.couponInfo}>
                      <Text style={[styles.couponTitle, coupon.is_redeemed && styles.redeemedText]}>
                        {coupon.title}
                      </Text>
                      <Text style={styles.couponCost}>
                        {coupon.bolt_cost} Bolts • {coupon.category}
                        {coupon.is_redeemed &&
                          ` • ${new Date(coupon.created_at).toLocaleDateString()}`}
                      </Text>
                    </View>
                    {!coupon.is_redeemed && (
                      <View style={styles.itemActions}>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => setEditingCoupon(coupon)}
                        >
                          <Edit2 size={18} color={AppColors.sleepyBlue} />
                        </Pressable>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => confirmDelete(coupon.id)}
                        >
                          <Trash2 size={18} color={AppColors.error} />
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
            </ScrollView>
          )}

          {/* Add Reward Modal */}
          <Modal visible={showAddModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingCoupon ? 'Edit Reward' : 'New Reward'}
                </Text>

                <TextInput
                  style={[styles.input, !!error && error.includes('Title') && styles.inputError]}
                  placeholder="Reward title (e.g., Ice Cream)"
                  placeholderTextColor={AppColors.textMuted}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    setError('');
                  }}
                />

                <TextInput
                  style={[styles.input, !!error && error.includes('Bolt') && styles.inputError]}
                  placeholder="Bolt cost"
                  placeholderTextColor={AppColors.textMuted}
                  value={boltCost}
                  onChangeText={(text) => {
                    setBoltCost(text);
                    setError('');
                  }}
                  keyboardType="number-pad"
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryPicker}>
                  {(['Physical', 'Privilege', 'Activity'] as Category[]).map((cat) => (
                    <Pressable
                      key={cat}
                      style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryBtnText,
                          category === cat && styles.categoryBtnTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalBtn, styles.cancelBtn]}
                    onPress={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={handleAddReward}>
                    <Text style={styles.saveBtnText}>Save Reward</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Reward Shop</Text>
          <View style={styles.balanceContainer}>
            <Star size={20} color={AppColors.rewardGold} fill={AppColors.rewardGold} />
            <Text style={styles.balanceText}>{profile?.bolt_balance || 0} Gold Bolts</Text>
          </View>
          <Text style={styles.description}>Trade your Gold Bolts for awesome prizes here!</Text>

          {filteredCoupons.length === 0 ? (
            <EmptyState
              icon={Gift}
              title="Shop is Empty"
              message="Ask your parent to add some rewards for you!"
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.shopGrid}
              showsVerticalScrollIndicator={false}
            >
              {filteredCoupons.map((coupon) => (
                <View key={coupon.id} style={styles.shopCard}>
                  <View style={styles.cardIcon}>
                    {coupon.category === 'Physical' && <Gift size={32} color={AppColors.error} />}
                    {coupon.category === 'Privilege' && (
                      <Shield size={32} color={AppColors.dinoGreen} />
                    )}
                    {coupon.category === 'Activity' && (
                      <Activity size={32} color={AppColors.missionOrange} />
                    )}
                  </View>
                  <Text style={styles.cardTitle}>{coupon.title}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardCost}>{coupon.bolt_cost} Bolts</Text>
                    <ScaleButton
                      style={[
                        styles.redeemBtn,
                        (profile?.bolt_balance || 0) < coupon.bolt_cost && styles.disabledBtn,
                      ]}
                      disabled={(profile?.bolt_balance || 0) < coupon.bolt_cost}
                      onPress={() => setConfirmingCoupon(coupon)}
                    >
                      <Text style={styles.redeemBtnText}>Redeem</Text>
                    </ScaleButton>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Confirm Redemption Modal */}
          <Modal visible={!!confirmingCoupon} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, styles.confirmModal]}>
                <View style={styles.confirmIcon}>
                  <Gift size={64} color={AppColors.error} />
                </View>
                <Text style={styles.modalTitle}>Redeem Reward?</Text>
                <Text style={styles.confirmText}>
                  Are you sure you want to use {confirmingCoupon?.bolt_cost} Gold Bolts for "
                  {confirmingCoupon?.title}"?
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.modalBtn, styles.cancelBtn, styles.largeBtn]}
                    onPress={() => setConfirmingCoupon(null)}
                  >
                    <Text style={styles.cancelBtnText}>Not Now</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalBtn, styles.saveBtn, styles.largeBtn]}
                    onPress={() => confirmingCoupon && handleRedeem(confirmingCoupon)}
                  >
                    <Text style={styles.saveBtnText}>Yes! Redeem</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          {/* Success Overlay */}
          <Modal visible={showSuccess} animationType="fade" transparent>
            <View style={styles.successOverlay}>
              <BuddyAnimation buddy={(selectedBuddy as any) || 'dino'} state="success" size={250} />
              <View style={styles.successContent}>
                <CheckCircle2 size={80} color={AppColors.dinoGreen} />
                <Text style={styles.successTitle}>Hooray!</Text>
                <Text style={styles.successText}>You got "{successReward?.title}"!</Text>
                <ScaleButton style={styles.successBtn} onPress={() => setShowSuccess(false)}>
                  <Text style={styles.successBtnText}>Awesome!</Text>
                </ScaleButton>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    minHeight: 44,
  },
  headerButtonText: {
    fontSize: 12,
    color: AppColors.textMuted,
    marginLeft: 5,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'FredokaOne_400Regular',
    color: AppColors.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
  description: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: 20,
    fontFamily: 'Nunito_400Regular',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppColors.rewardGold}1A`,
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: AppColors.rewardGold,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
    color: AppColors.rewardGold,
    fontFamily: 'FredokaOne_400Regular',
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    minHeight: 44,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 5,
    fontFamily: 'Nunito_700Bold',
  },
  list: {
    flex: 1,
  },
  couponItem: {
    flexDirection: 'row',
    backgroundColor: AppColors.cardDark,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  redeemedItem: {
    backgroundColor: AppColors.cardMedium,
    opacity: 0.8,
  },
  redeemedText: {
    textDecorationLine: 'line-through',
    color: AppColors.textMuted,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
  couponCost: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  itemActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 12,
    marginLeft: 5,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  shopCard: {
    width: '48%',
    backgroundColor: AppColors.cardDark,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: AppColors.elevated,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 10,
    height: 40,
    fontFamily: 'FredokaOne_400Regular',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: AppColors.elevated,
    paddingTop: 10,
  },
  cardCost: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.rewardGold,
    marginBottom: 8,
    fontFamily: 'FredokaOne_400Regular',
  },
  redeemBtn: {
    backgroundColor: AppColors.error,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  redeemBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  disabledBtn: {
    backgroundColor: AppColors.cardMedium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: AppColors.cardDark,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: AppColors.elevated,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
  input: {
    backgroundColor: AppColors.elevated,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: AppColors.textPrimary,
    fontFamily: 'Nunito_400Regular',
  },
  inputError: {
    borderColor: AppColors.error,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: AppColors.textPrimary,
    fontFamily: 'Nunito_700Bold',
  },
  categoryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: AppColors.elevated,
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: AppColors.dinoGreen,
  },
  categoryBtnText: {
    fontWeight: '600',
    color: AppColors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
  categoryBtnTextActive: {
    color: '#FFF',
  },
  errorText: {
    color: AppColors.error,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: AppColors.cardMedium,
  },
  saveBtn: {
    backgroundColor: AppColors.dinoGreen,
  },
  cancelBtnText: {
    color: AppColors.textSecondary,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
  },
  confirmModal: {
    alignItems: 'center',
  },
  confirmIcon: {
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: AppColors.textSecondary,
    lineHeight: 24,
    fontFamily: 'Nunito_600SemiBold',
  },
  largeBtn: {
    paddingVertical: 20,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: AppColors.dinoGreen,
    fontFamily: 'FredokaOne_400Regular',
    marginTop: 20,
  },
  successText: {
    fontSize: 20,
    color: AppColors.textPrimary,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  successBtn: {
    backgroundColor: AppColors.rewardGold,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  successBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: AppColors.cardDark,
    fontFamily: 'FredokaOne_400Regular',
  },
});
