import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    maybeCompleteAuthSession();

    // On web, if we were redirected here directly (not via a popup),
    // we should navigate back to the app root.
    // The RootLayout will detect the session and route accordingly.
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
