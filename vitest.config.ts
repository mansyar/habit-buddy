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
          include: ['@react-native-community/netinfo'],
        },
      },
    },
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    server: {
      deps: {
        inline: ['@react-native-community/netinfo'],
        external: ['@react-native-community/netinfo'],
      },
    },
  },
});
