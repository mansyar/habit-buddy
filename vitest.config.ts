import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },
    deps: {
      optimizer: {
        web: {
          include: ['@react-native-community/netinfo', 'react-native-error-boundary'],
        },
      },
    },
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'app/**/__tests__/**',
        'src/types/**',
        'src/constants/**',
        '**/*.d.ts',
        'app/_layout.tsx',
        'app/+html.tsx',
        'app/+not-found.tsx',
        'app/(tabs)/_layout.tsx',
        'app/login-callback.tsx',
        'app/modal.tsx',
        'app/settings.tsx',
        'src/components/EditScreenInfo.tsx',
        'src/components/ExternalLink.tsx',
        'src/components/StyledText.tsx',
        'src/components/useClientOnlyValue.ts',
        'src/components/useClientOnlyValue.web.ts',
        'src/components/useColorScheme.ts',
        'src/components/useColorScheme.web.ts',
      ],
    },
    server: {
      deps: {
        inline: ['@react-native-community/netinfo', 'react-native-error-boundary'],
        external: ['@react-native-community/netinfo'],
      },
    },
  },
});
