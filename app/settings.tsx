import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack, useRouter } from 'expo-router';
import { AppColors } from '@/theme/Colors';
import { ChevronLeft, User, LogOut, Info } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth_store';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, setUser, setProfile } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace('/sign-in');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: AppColors.deepIndigo },
          headerTintColor: AppColors.textPrimary,
          headerTitleStyle: { fontFamily: 'FredokaOne_400Regular' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={AppColors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <User size={40} color={AppColors.textMuted} />
          </View>
          <Text style={styles.profileName}>{profile?.child_name || 'Buddy'}</Text>
          <Text style={styles.profileType}>
            {profile?.is_guest ? 'Guest Account' : 'Parent Account'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <LogOut size={20} color={AppColors.error} />
            <Text style={[styles.menuItemText, { color: AppColors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.menuItem}>
            <Info size={20} color={AppColors.textMuted} />
            <Text style={styles.menuItemText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: AppColors.cardDark,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'FredokaOne_400Regular',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  profileType: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: AppColors.textMuted,
    marginLeft: 12,
    marginBottom: 12,
    letterSpacing: 1,
    fontFamily: 'Nunito_700Bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardDark,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    minHeight: 56, // Ensure > 48dp
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginLeft: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});
