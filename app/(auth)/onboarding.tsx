import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';
import { profileService } from '../../src/lib/profile_service';
import { Colors } from '../../src/theme/Colors';
import { validateChildName } from '../../src/utils/validation';

const AVATARS = [
  { id: 'dog', name: '🐶' },
  { id: 'cat', name: '🐱' },
  { id: 'rabbit', name: '🐰' },
  { id: 'bear', name: '🐻' },
  { id: 'fox', name: '🦊' },
  { id: 'koala', name: '🐨' },
];

const BUDDIES = [
  { id: 'dino', name: 'Dino', emoji: '🦖' },
  { id: 'bear', name: 'Bear', emoji: '🐻' },
];

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('dog');
  const [selectedBuddy, setSelectedBuddy] = useState('dino');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, setProfile } = useAuthStore();

  const handleNameChange = (text: string) => {
    setName(text);
    if (text.trim().length > 20) {
      setError(validateChildName(text));
    } else {
      setError(null);
    }
  };

  const isNameValid = validateChildName(name) === null;

  const handleFinishOnboarding = async () => {
    if (!isNameValid) return;

    try {
      const profileData = {
        child_name: name.trim(),
        avatar_id: selectedAvatar,
        selected_buddy: selectedBuddy,
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
          style={[styles.input, !!error && styles.inputError]}
          placeholder="Enter child's name"
          value={name}
          onChangeText={handleNameChange}
          testID="child-name-input"
          maxLength={30} // Allow typing more to show validation error
        />
        {!!error && <Text style={styles.errorText}>{error}</Text>}
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
            <Text style={avatarEmojiStyle}>{avatar.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Pick a Buddy!</Text>
      <View style={styles.buddyGrid}>
        {BUDDIES.map((buddy) => (
          <TouchableOpacity
            key={buddy.id}
            testID={`buddy-${buddy.id}`}
            style={[styles.buddyButton, selectedBuddy === buddy.id && styles.selectedBuddy]}
            onPress={() => setSelectedBuddy(buddy.id)}
          >
            <Text style={styles.buddyEmoji}>{buddy.emoji}</Text>
            <Text style={styles.buddyName}>{buddy.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.goButton, !isNameValid && styles.disabledButton]}
        onPress={handleFinishOnboarding}
        disabled={!isNameValid}
      >
        <Text style={styles.goButtonText}>Let's Go!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const avatarEmojiStyle = {
  fontSize: 30,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
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
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 5,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: Colors.light.tint,
    backgroundColor: '#E1F5FE',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  buddyGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
  },
  buddyButton: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedBuddy: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  buddyEmoji: {
    fontSize: 50,
    marginBottom: 5,
  },
  buddyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  goButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  goButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
