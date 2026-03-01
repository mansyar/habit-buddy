import { expect, test, vi, describe, beforeEach } from 'vitest';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../auth_store';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';

vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setProfile(null);
    useAuthStore.getState().setLoading(true);
    // @ts-ignore
    Platform.OS = 'ios';
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

  describe('Actions', () => {
    test('signOut should clear user and profile', async () => {
      (supabase.auth.signOut as any).mockResolvedValue({ error: null });

      useAuthStore.getState().setUser({ id: '123' } as any);
      useAuthStore.getState().setProfile({ id: '123' } as any);

      await useAuthStore.getState().signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().profile).toBeNull();
    });

    test('signInWithGoogle should initiate OAuth flow', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: { url: 'https://google-auth-url.com' },
        error: null,
      });
      (WebBrowser.openAuthSessionAsync as any).mockResolvedValue({ type: 'success' });

      await useAuthStore.getState().signInWithGoogle();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'habitbuddy://login-callback/',
          skipBrowserRedirect: true,
        },
      });
      expect(WebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(
        'https://google-auth-url.com',
        'habitbuddy://login-callback/',
      );
    });

    test('signInWithGoogle should handle error', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: { url: null },
        error: { message: 'OAuth Error' },
      });

      await expect(useAuthStore.getState().signInWithGoogle()).rejects.toThrow('OAuth Error');
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    test('signInWithGoogle should handle missing URL', async () => {
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: { url: null },
        error: null,
      });

      await expect(useAuthStore.getState().signInWithGoogle()).rejects.toThrow(
        'No OAuth URL returned',
      );
    });

    test('signInWithGoogle should handle web platform', async () => {
      // @ts-ignore
      Platform.OS = 'web';
      (supabase.auth.signInWithOAuth as any).mockResolvedValue({
        data: { url: null },
        error: null,
      });

      await useAuthStore.getState().signInWithGoogle();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'habitbuddy://login-callback/',
          skipBrowserRedirect: false,
        },
      });
      expect(WebBrowser.openAuthSessionAsync).not.toHaveBeenCalled();
    });

    test('signOut should handle error', async () => {
      (supabase.auth.signOut as any).mockResolvedValue({ error: { message: 'SignOut Error' } });

      await expect(useAuthStore.getState().signOut()).rejects.toThrow('SignOut Error');
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
