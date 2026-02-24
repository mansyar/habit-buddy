import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Profile } from '../types/profile';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  signInWithGoogle: () => Promise<WebBrowser.WebBrowserAuthSessionResult | void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'habitbuddy',
        path: 'login-callback/',
      });

      const isWeb = Platform.OS === 'web';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: !isWeb, // Don't skip on web so it redirects directly
        },
      });

      if (error) throw error;

      // On web, signInWithOAuth will handle the redirect automatically if skipBrowserRedirect is false
      if (isWeb) return;

      if (!data.url) throw new Error('No OAuth URL returned');

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      return result;
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
