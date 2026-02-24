import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Alert } from 'react-native';
import SignInScreen from '../sign-in';
import { profileService } from '../../../src/lib/profile_service';
import { useAuthStore } from '../../../src/store/auth_store';
import { routerMock } from '../../../vitest.setup';

// Mock AuthStore
const mockSignInWithGoogle = vi.fn();
const mockSetProfile = vi.fn();

vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(() => ({
    setProfile: mockSetProfile,
    signInWithGoogle: mockSignInWithGoogle,
  })),
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders Google and Guest buttons', () => {
    const { getByText } = render(<SignInScreen />);

    expect(getByText('Sign in with Google')).toBeTruthy();
    expect(getByText('Continue as Guest')).toBeTruthy();
  });

  test('calls signInWithGoogle when Google button is pressed', async () => {
    mockSignInWithGoogle.mockResolvedValue({ type: 'success' });
    const { getByTestId } = render(<SignInScreen />);
    const googleButton = getByTestId('google-signin-button');

    fireEvent.click(googleButton);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  test('shows Alert when signInWithGoogle fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Auth failed'));
    const { getByTestId } = render(<SignInScreen />);
    const googleButton = getByTestId('google-signin-button');

    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Sign In Error', 'Auth failed');
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
