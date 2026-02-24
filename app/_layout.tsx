import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth_store';
import { profileService } from '@/lib/profile_service';
import { initializeSQLite } from '@/lib/sqlite';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    initializeSQLite().then(() => {
      setDbLoaded(true);
    });
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && dbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbLoaded]);

  if (!loaded || !dbLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, profile, isLoading, setUser, setProfile, setLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Initial fetch of user and profile
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const initialUser = session?.user ?? null;
      setUser(initialUser);
      if (initialUser) {
        const profileData = await profileService.getProfile(initialUser.id);
        setProfile(profileData);
      } else {
        // Check for guest profile if no Supabase session
        const guestProfile = await profileService.getGuestProfile();
        setProfile(guestProfile);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        const profileData = await profileService.getProfile(newUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    const isAuthenticated = !!user || (!!profile && profile.is_guest);

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      router.replace('/sign-in');
    } else if (isAuthenticated && !profile && !inAuthGroup && !inOnboarding) {
      router.replace('/onboarding');
    } else if (isAuthenticated && profile && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [user, profile, isLoading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
