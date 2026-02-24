import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useEffect } from 'react';

export default function LoginCallback() {
  useEffect(() => {
    maybeCompleteAuthSession();
  }, []);

  return null;
}
