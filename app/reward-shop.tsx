import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';
import { ParentalGate } from '@/components/ParentalGate';
import { couponService } from '@/lib/coupon_service';
import { Coupon } from '@/types/coupon';
import { useAuthStore } from '@/store/auth_store';
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
} from 'lucide-react-native';

type Category = 'Physical' | 'Privilege' | 'Activity';

export default function RewardShopScreen() {
  const { profile } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [boltCost, setBoltCost] = useState('');
  const [category, setCategory] = useState<Category>('Physical');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      loadCoupons();
    }
  }, [profile]);

  useEffect(() => {
    if (editingCoupon) {
      setTitle(editingCoupon.title);
      setBoltCost(editingCoupon.bolt_cost.toString());
      setCategory(editingCoupon.category);
      setShowAddModal(true);
    }
  }, [editingCoupon]);

  const loadCoupons = async () => {
    if (profile) {
      const data = await couponService.getCoupons(profile.id);
      setCoupons(data);
    }
  };

  const handleAddReward = async () => {
    if (!profile) return;

    const cost = parseInt(boltCost, 10);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (isNaN(cost) || cost < 1) {
      setError('Bolt cost must be at least 1');
      return;
    }

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
    } catch (e) {
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
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isAdmin ? 'Manage Rewards' : 'Reward Shop',
          headerRight: () => (
            <ParentalGate
              onSuccess={() => setIsAdmin(!isAdmin)}
              delay={process.env.NODE_ENV === 'test' ? 10 : 3000}
            >
              <View style={styles.headerButton}>
                {isAdmin ? <X size={24} color="#FF4B4B" /> : <Settings size={24} color="#666" />}
                <Text style={styles.headerButtonText}>{isAdmin ? 'Exit' : 'Parent Settings'}</Text>
              </View>
            </ParentalGate>
          ),
        }}
      />

      {isAdmin ? (
        <View style={styles.content}>
          <View style={styles.adminHeader}>
            <Text style={styles.subtitle}>Parent Control Panel</Text>
            <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
              <Plus size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add New Reward</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.list}>
            {coupons
              .filter((c) => !c.is_redeemed)
              .map((coupon) => (
                <View key={coupon.id} style={styles.couponItem}>
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponTitle}>{coupon.title}</Text>
                    <Text style={styles.couponCost}>
                      {coupon.bolt_cost} Bolts • {coupon.category}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <Pressable style={styles.iconButton} onPress={() => setEditingCoupon(coupon)}>
                      <Edit2 size={18} color="#4A90E2" />
                    </Pressable>
                    <Pressable style={styles.iconButton} onPress={() => confirmDelete(coupon.id)}>
                      <Trash2 size={18} color="#FF4B4B" />
                    </Pressable>
                  </View>
                </View>
              ))}
          </ScrollView>

          {/* Add Reward Modal */}
          <Modal visible={showAddModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Reward</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Reward title (e.g., Ice Cream)"
                  value={title}
                  onChangeText={setTitle}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Bolt cost"
                  value={boltCost}
                  onChangeText={setBoltCost}
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
            <Star size={24} color="#FFD700" fill="#FFD700" />
            <Text style={styles.balanceText}>{profile?.bolt_balance || 0} Gold Bolts</Text>
          </View>
          <Text style={styles.description}>Trade your Gold Bolts for awesome prizes here!</Text>

          <ScrollView contentContainerStyle={styles.shopGrid}>
            {coupons
              .filter((c) => !c.is_redeemed)
              .map((coupon) => (
                <View key={coupon.id} style={styles.shopCard}>
                  <View style={styles.cardIcon}>
                    {coupon.category === 'Physical' && <Gift size={32} color="#FF6B6B" />}
                    {coupon.category === 'Privilege' && <Shield size={32} color="#4ECDC4" />}
                    {coupon.category === 'Activity' && <Activity size={32} color="#45B7D1" />}
                  </View>
                  <Text style={styles.cardTitle}>{coupon.title}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardCost}>{coupon.bolt_cost} Bolts</Text>
                    <Pressable
                      style={[
                        styles.redeemBtn,
                        (profile?.bolt_balance || 0) < coupon.bolt_cost && styles.disabledBtn,
                      ]}
                      disabled={(profile?.bolt_balance || 0) < coupon.bolt_cost}
                    >
                      <Text style={styles.redeemBtnText}>Redeem</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  headerButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Fredoka-One',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
    color: '#333',
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
    backgroundColor: '#4ECDC4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  couponItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  couponCost: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    height: 40,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  cardCost: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 8,
  },
  redeemBtn: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  redeemBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: '#CCC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
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
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#4ECDC4',
  },
  categoryBtnText: {
    fontWeight: '600',
    color: '#666',
  },
  categoryBtnTextActive: {
    color: '#FFF',
  },
  errorText: {
    color: '#FF4B4B',
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
    backgroundColor: '#F0F0F0',
  },
  saveBtn: {
    backgroundColor: '#4ECDC4',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: '700',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
