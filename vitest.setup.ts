import { vi } from 'vitest';
import React from 'react';

// Shared router mock
export const routerMock = {
  replace: vi.fn(),
  push: vi.fn(),
  back: vi.fn(),
};

// Mock react-native
vi.mock('react-native', () => {
  return {
    View: ({ testID, children, style, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': testID, style }, children),
    Text: ({ testID, children, style, ...props }: any) =>
      React.createElement('span', { ...props, 'data-testid': testID, style }, children),
    TouchableOpacity: ({ testID, onPress, children, style, disabled, ...props }: any) =>
      React.createElement(
        'button',
        { ...props, 'data-testid': testID, onClick: onPress, style, disabled },
        children,
      ),
    TextInput: ({ testID, value, onChangeText, style, placeholder, ...props }: any) =>
      React.createElement('input', {
        ...props,
        'data-testid': testID,
        value,
        onChange: (e: any) => onChangeText(e.target.value),
        style,
        placeholder,
      }),
    ScrollView: ({ testID, children, contentContainerStyle, ...props }: any) =>
      React.createElement(
        'div',
        { ...props, 'data-testid': testID, style: contentContainerStyle },
        children,
      ),
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => style,
    },
    Platform: {
      select: (objs: any) => objs.ios || objs.android || objs.default,
      OS: 'ios',
    },
  };
});

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(() => routerMock),
  useSegments: vi.fn(() => []),
  Link: 'Link',
  Stack: 'Stack',
  Tabs: 'Tabs',
}));

// Mock expo-font
vi.mock('expo-font', () => ({
  loadAsync: vi.fn(),
  isLoaded: vi.fn(() => true),
}));

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

// Mock NetInfo
vi.mock('@react-native-community/netinfo', () => {
  return {
    __esModule: true,
    default: {
      fetch: vi.fn(() => Promise.resolve({ isConnected: true })),
      addEventListener: vi.fn(() => () => {}),
      useNetInfo: vi.fn(() => ({ isConnected: true })),
    },
    fetch: vi.fn(() => Promise.resolve({ isConnected: true })),
    addEventListener: vi.fn(() => () => {}),
    useNetInfo: vi.fn(() => ({ isConnected: true })),
  };
});
