import React from 'react';
import { render, act } from '@testing-library/react';
import { OfflineBanner } from '../OfflineBanner';
import { networkService } from '@/lib/network';

// Mock NetworkService
vi.mock('@/lib/network', () => ({
  networkService: {
    isOnline: vi.fn(() => Promise.resolve(true)),
    subscribeToConnectionChange: vi.fn(() => () => {}),
    getHasSyncError: vi.fn(() => false),
    subscribeToSyncError: vi.fn(() => () => {}),
  },
}));

describe('OfflineBanner', () => {
  let triggerConnectionChange: (isOnline: boolean) => void;
  let triggerSyncError: (hasError: boolean) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(networkService.subscribeToConnectionChange).mockImplementation((cb) => {
      triggerConnectionChange = cb;
      return () => {};
    });
    vi.mocked(networkService.subscribeToSyncError).mockImplementation((cb) => {
      triggerSyncError = cb;
      return () => {};
    });
  });

  it('should not be visible when online and no sync error', () => {
    const { queryByText } = render(<OfflineBanner />);

    // Simulate online
    act(() => {
      triggerConnectionChange(true);
      triggerSyncError(false);
    });

    expect(queryByText('Offline Mode')).toBeNull();
    expect(queryByText('Syncing failed')).toBeNull();
  });

  it('should be visible when offline', () => {
    const { getByText } = render(<OfflineBanner />);

    // Simulate offline
    act(() => {
      triggerConnectionChange(false);
    });

    expect(getByText('Offline Mode')).toBeTruthy();
  });

  it('should be visible when there is a sync error', () => {
    const { getByText } = render(<OfflineBanner />);

    // Simulate sync error
    act(() => {
      triggerSyncError(true);
    });

    expect(getByText('Syncing failed')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });
});
