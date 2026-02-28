import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NetworkStatusIcon } from '../NetworkStatusIcon';
import { networkService } from '@/lib/network';
import { vi } from 'vitest';

vi.mock('@/lib/network', () => ({
  networkService: {
    isOnline: vi.fn(() => Promise.resolve(true)),
    subscribeToConnectionChange: vi.fn((callback) => {
      // Store callback to trigger it manually
      (global as any).triggerConnectionChange = callback;
      return vi.fn(); // Unsubscribe
    }),
  },
}));

describe('NetworkStatusIcon', () => {
  it('renders Cloud icon when online', async () => {
    (networkService.isOnline as any).mockResolvedValue(true);

    render(<NetworkStatusIcon />);

    await waitFor(() => {
      expect(screen.getByTestId('icon-Cloud')).toBeTruthy();
    });
  });

  it('renders CloudOff icon when offline', async () => {
    (networkService.isOnline as any).mockResolvedValue(false);

    render(<NetworkStatusIcon />);

    // Manually trigger offline
    if ((global as any).triggerConnectionChange) {
      (global as any).triggerConnectionChange(false);
    }

    await waitFor(() => {
      expect(screen.getByTestId('icon-CloudOff')).toBeTruthy();
    });
  });
});
