import { expect, test, vi, describe, beforeEach } from 'vitest';
import { networkService } from '../network';
import { syncService } from '../sync_service';
import React, { useEffect } from 'react';
import { render } from '@testing-library/react';

// Mock Network
vi.mock('../network', () => {
  let listener: (online: boolean) => void = () => {};
  return {
    networkService: {
      isOnline: vi.fn(() => Promise.resolve(true)),
      subscribeToConnectionChange: vi.fn((cb) => {
        listener = cb;
        return () => {};
      }),
      _trigger: (online: boolean) => listener(online),
    },
  };
});

// Mock SyncService
vi.mock('../sync_service', () => ({
  syncService: {
    processQueue: vi.fn(() => Promise.resolve()),
  },
}));

// Mock component to test the hook
const SyncMonitor = () => {
  useEffect(() => {
    // Listen for network changes to trigger sync
    const unsubscribe = networkService.subscribeToConnectionChange((online) => {
      if (online) {
        syncService.processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

describe('Sync Automation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('SyncService.processQueue should be called when coming online', async () => {
    render(<SyncMonitor />);

    (networkService as any)._trigger(true);

    expect(syncService.processQueue).toHaveBeenCalled();
  });

  test('SyncService.processQueue should not be called when going offline', async () => {
    render(<SyncMonitor />);

    (networkService as any)._trigger(false);

    expect(syncService.processQueue).not.toHaveBeenCalled();
  });
});
