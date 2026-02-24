import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import OnboardingScreen from '../onboarding';
import { profileService } from '../../../src/lib/profile_service';
import { useAuthStore } from '../../../src/store/auth_store';
import { routerMock } from '../../../vitest.setup';

// Mock ProfileService
vi.mock('../../../src/lib/profile_service', () => ({
  profileService: {
    createProfile: vi.fn(() => Promise.resolve({ id: '123', child_name: 'Buddy' })),
  },
}));

// Mock AuthStore
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user123' },
    setProfile: vi.fn(),
  })),
}));

describe('OnboardingScreen', () => {
  test('renders input and avatar selection', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen />);

    expect(getByPlaceholderText("Enter child's name")).toBeTruthy();
    expect(getByText('Select an Avatar')).toBeTruthy();
  });

  test('calls createProfile and navigates to home when "Let\'s Go!" is pressed', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<OnboardingScreen />);
    const nameInput = getByPlaceholderText("Enter child's name");
    const goButton = getByText("Let's Go!");

    fireEvent.change(nameInput, { target: { value: 'Rex' } });

    // Simulate selecting an avatar
    const avatarButton = getByTestId('avatar-dog');
    fireEvent.click(avatarButton);

    fireEvent.click(goButton);

    await waitFor(() => {
      expect(profileService.createProfile).toHaveBeenCalledWith(
        expect.objectContaining({ child_name: 'Rex', avatar_id: 'dog' }),
        'user123',
      );
    });

    await waitFor(() => {
      expect(routerMock.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
