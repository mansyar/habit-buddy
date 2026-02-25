import { vi } from 'vitest';
import React from 'react';

// Shared router mock
export const routerMock = {
  replace: vi.fn(),
  push: vi.fn(),
  back: vi.fn(),
};

// Mock SQLite methods
const mockSQLiteDb = {
  execSync: vi.fn(),
  runSync: vi.fn(),
  getFirstSync: vi.fn(),
  getAllSync: vi.fn(),
  execAsync: vi.fn(async () => {}),
  runAsync: vi.fn(async () => {}),
  getFirstAsync: vi.fn(async () => null),
  getAllAsync: vi.fn(async () => []),
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
    Dimensions: {
      get: vi.fn(() => ({ width: 375, height: 812 })),
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    },
    Alert: {
      alert: vi.fn(),
    },
    AppState: {
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
      currentState: 'active',
    },
  };
});

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(() => routerMock),
  useSegments: vi.fn(() => []),
  Link: ({ children }: any) => children,
  Stack: Object.assign(({ children }: any) => children, {
    Screen: vi.fn(() => null),
  }),
  Tabs: ({ children }: any) => children,
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

// Mock expo-crypto
vi.mock('expo-crypto', () => ({
  randomUUID: vi.fn(() => 'test-uuid-' + Math.random()),
}));

// Mock expo-auth-session
vi.mock('expo-auth-session', () => ({
  makeRedirectUri: vi.fn(() => 'habitbuddy://login-callback/'),
  startAsync: vi.fn(),
  dismiss: vi.fn(),
}));

// Mock expo-web-browser
vi.mock('expo-web-browser', () => ({
  openBrowserAsync: vi.fn(),
  openAuthSessionAsync: vi.fn(),
  dismissBrowser: vi.fn(),
}));

// Mock expo
vi.mock('expo', () => ({
  registerRootComponent: vi.fn(),
  requireNativeModule: vi.fn(() => ({})),
  requireOptionalNativeModule: vi.fn(() => ({})),
}));

// Mock expo-sqlite
vi.mock('expo-sqlite', () => ({
  openDatabaseSync: vi.fn(() => mockSQLiteDb),
  openDatabaseAsync: vi.fn(async () => mockSQLiteDb),
  SQLiteProvider: ({ children }: any) => children,
  useSQLiteContext: vi.fn(),
}));

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: vi.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
}));

// Mock react-native-svg
vi.mock('react-native-svg', () => ({
  Svg: ({ children }: any) => children,
  Circle: ({ children }: any) => children,
  G: ({ children }: any) => children,
  Path: ({ children }: any) => children,
  Rect: ({ children }: any) => children,
  Ellipse: ({ children }: any) => children,
  default: ({ children }: any) => children,
}));

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => {
  const Reanimated = {
    View: ({ testID, children, style, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': testID, style }, children),
    Text: ({ testID, children, style, ...props }: any) =>
      React.createElement('span', { ...props, 'data-testid': testID, style }, children),
    createAnimatedComponent: (component: any) => component,
    useAnimatedProps: vi.fn((cb) => cb()),
    useDerivedValue: vi.fn((cb) => ({ value: cb() })),
    useSharedValue: vi.fn((val) => ({ value: val })),
    useAnimatedStyle: vi.fn((cb) => cb()),
    withTiming: vi.fn((val) => val),
    withSequence: vi.fn((...vals) => vals[0]),
    withSpring: vi.fn((val) => val),
    withRepeat: vi.fn((val) => val),
    withDelay: vi.fn((delay, val) => val),
    cancelAnimation: vi.fn(),
    interpolate: vi.fn((val, input, output) => val),
    Easing: {
      inOut: vi.fn((cb: any) => cb),
      out: vi.fn((cb: any) => cb),
      in: vi.fn((cb: any) => cb),
      bezier: vi.fn(
        (...args: any[]) =>
          (t: number) =>
            t,
      ),
      ease: vi.fn(),
      quad: vi.fn(),
    },
  };
  return {
    ...Reanimated,
    default: Reanimated,
    Animated: Reanimated,
  };
});

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

// Mock Supabase Helper
const createSupabaseMock = () => {
  const mock: any = {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    from: vi.fn(() => mock),
    select: vi.fn(() => mock),
    insert: vi.fn(() => mock),
    update: vi.fn(() => mock),
    upsert: vi.fn(() => mock),
    delete: vi.fn(() => mock),
    eq: vi.fn(() => mock),
    or: vi.fn(() => mock),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
  };
  return mock;
};

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => createSupabaseMock()),
}));

// Set dummy env vars for Supabase initialization in tests
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
