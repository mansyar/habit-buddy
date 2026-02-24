import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { profileService } from '../../src/lib/profile_service';
import { useAuthStore } from '../../src/store/auth_store';
import { Colors } from '../../src/theme/Colors';

export default function SignInScreen() {
  const router = useRouter();
  const { setProfile, signInWithGoogle } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return; // Web redirect in progress

      if (result.type === 'error') {
        Alert.alert('Sign In Error', 'An error occurred during Google sign in.');
      } else if (result.type === 'cancel') {
        // User cancelled, no action needed or a toast
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      Alert.alert('Sign In Error', message);
    }
  };

  const handleGuestSignIn = async () => {
    // Check if a guest profile already exists locally
    const existingGuest = await profileService.getGuestProfile();
    if (existingGuest) {
      setProfile(existingGuest);
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HabitBuddy</Text>

      <TouchableOpacity
        testID="google-signin-button"
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="guest-signin-button"
        style={styles.guestButton}
        onPress={handleGuestSignIn}
      >
        <Text style={styles.guestButtonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Colors.light.text,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 10,
  },
  guestButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
