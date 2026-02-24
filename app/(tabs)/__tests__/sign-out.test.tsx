import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TabTwoScreen from '../two';
import { supabase } from '../../../src/lib/supabase';

// Mock Supabase
vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

// Mock Themed components to avoid expo dependency issues in tests
vi.mock('../../../src/components/Themed', () => ({
  Text: ({ children, style }: any) => <span style={style}>{children}</span>,
  View: ({ children, style }: any) => <div style={style}>{children}</div>,
}));

// Mock EditScreenInfo
vi.mock('../../../src/components/EditScreenInfo', () => ({
  EditScreenInfo: () => null,
}));

describe('TabTwoScreen (Sign Out)', () => {
  test('calls signOut when Sign Out button is pressed', async () => {
    const { getByText } = render(<TabTwoScreen />);
    const signOutButton = getByText('Sign Out');

    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
