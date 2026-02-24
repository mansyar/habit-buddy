import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignInScreen from '../sign-in';
import { supabase } from '../../../src/lib/supabase';
import { useRouter } from 'expo-router';

// Mock Supabase
vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
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

  test('navigates to onboarding when Guest button is pressed', () => {
    const router = useRouter();
    const { getByTestId } = render(<SignInScreen />);
    const guestButton = getByTestId('guest-signin-button');

    fireEvent.click(guestButton);

    expect(router.replace).toHaveBeenCalledWith('/onboarding');
  });
});
