import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';
import { profileService } from '../../src/lib/profile_service';
import { Colors } from '../../src/theme/Colors';

const AVATARS = [
  { id: 'dog', name: '🐶' },
  { id: 'cat', name: '🐱' },
  { id: 'rabbit', name: '🐰' },
  { id: 'bear', name: '🐻' },
  { id: 'fox', name: '🦊' },
  { id: 'koala', name: '🐨' },
];

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('dog');
  const router = useRouter();
  const { user, setProfile } = useAuthStore();

  const handleFinishOnboarding = async () => {
    if (!name.trim()) return;

    try {
      const profileData = {
        child_name: name.trim(),
        avatar_id: selectedAvatar,
      };

      const profile = await profileService.createProfile(profileData, user?.id || null);
      if (profile) {
        setProfile(profile);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Let's set up your child's profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter child's name"
          value={name}
          onChangeText={setName}
          testID="child-name-input"
        />
      </View>

      <Text style={styles.label}>Select an Avatar</Text>
      <View style={styles.avatarGrid}>
        {AVATARS.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            testID={`avatar-${avatar.id}`}
            style={[styles.avatarButton, selectedAvatar === avatar.id && styles.selectedAvatar]}
            onPress={() => setSelectedAvatar(avatar.id)}
          >
            <Text style={styles.avatarEmoji}>{avatar.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.goButton, !name.trim() && styles.disabledButton]}
        onPress={handleFinishOnboarding}
        disabled={!name.trim()}
      >
        <Text style={styles.goButtonText}>Let's Go!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    backgroundColor: '#FFF',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  avatarButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: Colors.light.tint,
    backgroundColor: '#E1F5FE',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  goButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  goButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
