import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TabTwoScreen from '../two';
import { useAuthStore } from '../../../src/store/auth_store';
import { supabase } from '../../../src/lib/supabase';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('../../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

vi.mock('../../../src/components/EditScreenInfo', () => ({
  EditScreenInfo: () => null,
}));

vi.mock('../../../src/components/Themed', () => ({
  Text: ({ children, style }: any) => <span style={style}>{children}</span>,
  View: ({ children, style }: any) => <div style={style}>{children}</div>,
}));

// Mock react-native components
vi.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
  TouchableOpacity: ({ children, onPress }: any) => <button onClick={onPress}>{children}</button>,
  Platform: {
    OS: 'ios',
  },
}));

describe('TabTwoScreen (Settings)', () => {
  const mockSetProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ user: { id: 'user-123' } });
    (useAuthStore as any).getState = () => ({ setProfile: mockSetProfile });
  });

  it('renders settings title and sign out button', () => {
    const { getByText } = render(<TabTwoScreen />);
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('calls supabase signOut when user is logged in', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });
    const { getByText } = render(<TabTwoScreen />);

    fireEvent.click(getByText('Sign Out'));

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('logs error when supabase signOut fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (supabase.auth.signOut as any).mockResolvedValue({ error: { message: 'Sign out failed' } });
    const { getByText } = render(<TabTwoScreen />);

    fireEvent.click(getByText('Sign Out'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign out error:', 'Sign out failed');
    });
    consoleSpy.mockRestore();
  });

  it('clears profile state when in guest mode', async () => {
    (useAuthStore as any).mockReturnValue({ user: null });
    const { getByText } = render(<TabTwoScreen />);

    fireEvent.click(getByText('Sign Out'));

    expect(mockSetProfile).toHaveBeenCalledWith(null);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });
});
