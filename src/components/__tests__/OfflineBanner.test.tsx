import React from 'react';
import { render, act } from '@testing-library/react';
import { OfflineBanner } from '../OfflineBanner';
import { networkService } from '@/lib/network';

// Mock NetworkService
vi.mock('@/lib/network', () => ({
  networkService: {
    isOnline: vi.fn(() => Promise.resolve(true)),
    subscribeToConnectionChange: vi.fn(() => () => {}),
  },
}));

describe('OfflineBanner', () => {
  let triggerConnectionChange: (isOnline: boolean) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(networkService.subscribeToConnectionChange).mockImplementation((cb) => {
      triggerConnectionChange = cb;
      return () => {};
    });
  });

  it('should not be visible when online', () => {
    const { queryByText } = render(<OfflineBanner />);

    // Simulate online
    act(() => {
      triggerConnectionChange(true);
    });

    expect(queryByText('Offline Mode')).toBeNull();
  });

  it('should be visible when offline', () => {
    const { getByText } = render(<OfflineBanner />);

    // Simulate offline
    act(() => {
      triggerConnectionChange(false);
    });

    expect(getByText('Offline Mode')).toBeTruthy();
  });
});
