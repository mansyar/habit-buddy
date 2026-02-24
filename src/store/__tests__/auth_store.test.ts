import { expect, test, vi, describe, beforeEach } from 'vitest';
import { useAuthStore } from '../auth_store';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setProfile(null);
    useAuthStore.getState().setLoading(true);
  });

  test('should set user and loading state', () => {
    const mockUser = { id: '123', email: 'test@example.com' } as any;

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setLoading(false);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test('should set profile', () => {
    const mockProfile = { id: '123', name: 'Buddy', is_guest: false } as any;

    useAuthStore.getState().setProfile(mockProfile);

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });
});
