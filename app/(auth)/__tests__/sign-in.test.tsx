import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignInScreen from '../sign-in';
import { supabase } from '../../../src/lib/supabase';
import { profileService } from '../../../src/lib/profile_service';
import { useAuthStore } from '../../../src/store/auth_store';
import { routerMock } from '../../../vitest.setup';

// Mock Supabase
vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

// Mock ProfileService
vi.mock('../../../src/lib/profile_service', () => ({
  profileService: {
    getGuestProfile: vi.fn(() => Promise.resolve(null)),
  },
}));

// Mock AuthStore
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(() => ({
    setProfile: vi.fn(),
  })),
}));

describe('SignInScreen', () => {
  test('renders Google and Guest buttons', () => {
    const { getByText } = render(<SignInScreen />);

    expect(getByText('Sign in with Google')).toBeTruthy();
    expect(getByText('Continue as Guest')).toBeTruthy();
  });

  test('calls signInWithOAuth when Google button is pressed', async () => {
    const { getByTestId } = render(<SignInScreen />);
    const googleButton = getByTestId('google-signin-button');

    fireEvent.click(googleButton);

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
    });
  });

  test('navigates to onboarding when Guest button is pressed', async () => {
    const { getByTestId } = render(<SignInScreen />);
    const guestButton = getByTestId('guest-signin-button');

    fireEvent.click(guestButton);

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/onboarding');
    });
  });
});
