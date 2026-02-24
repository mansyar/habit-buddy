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
    TouchableOpacity: ({ testID, onPress, children, style, ...props }: any) =>
      React.createElement(
        'button',
        { ...props, 'data-testid': testID, onClick: onPress, style },
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
  Link: 'Link',
  Stack: 'Stack',
  Tabs: 'Tabs',
}));

// Mock expo-font
vi.mock('expo-font', () => ({
  loadAsync: vi.fn(),
  isLoaded: vi.fn(() => true),
}));
