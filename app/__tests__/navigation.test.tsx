import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { useAuthStore } from '../../src/store/auth_store';
import { useRouter, useSegments } from 'expo-router';
import { routerMock } from '../../vitest.setup';
import { View, Text } from 'react-native';

// Mock AuthStore
vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

// Create a mock component that uses the same logic as RootLayoutNav for testing redirects
const NavigationMonitor = () => {
  const { user, profile, isLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (user && !profile && segments[0] !== '(auth)' && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (user && profile && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, profile, isLoading, segments]);

  return (
    <View>
      <Text>User: {user ? 'Authenticated' : 'Guest'}</Text>
      <Text>Profile: {profile ? 'Created' : 'Missing'}</Text>
      <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
    </View>
  );
};

describe('Navigation Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('redirects to sign-in if not authenticated and not in auth group', async () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      profile: null,
      isLoading: false,
    });
    (useSegments as any).mockReturnValue(['(tabs)']);

    render(<NavigationMonitor />);

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/sign-in');
    });
  });

  test('redirects to onboarding if authenticated but profile is missing', async () => {
    (useAuthStore as any).mockReturnValue({
      user: { id: '123' },
      profile: null,
      isLoading: false,
    });
    (useSegments as any).mockReturnValue(['(tabs)']);

    render(<NavigationMonitor />);

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/onboarding');
    });
  });

  test('redirects to home if authenticated and has profile but in auth group', async () => {
    (useAuthStore as any).mockReturnValue({
      user: { id: '123' },
      profile: { name: 'Buddy' },
      isLoading: false,
    });
    (useSegments as any).mockReturnValue(['(auth)', 'sign-in']);

    render(<NavigationMonitor />);

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
