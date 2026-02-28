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
    TouchableOpacity: ({
      testID,
      onPress,
      onLongPress,
      children,
      style,
      disabled,
      ...props
    }: any) =>
      React.createElement(
        'button',
        {
          ...props,
          'data-testid': testID,
          onClick: onPress,
          onContextMenu: (e: any) => {
            if (onLongPress) {
              e.preventDefault();
              onLongPress();
            }
          },
          style,
          disabled,
        },
        children,
      ),
    Pressable: ({
      testID,
      onPress,
      onPressIn,
      onPressOut,
      children,
      style,
      disabled,
      ...props
    }: any) =>
      React.createElement(
        'button',
        {
          ...props,
          'data-testid': testID,
          onClick: onPress,
          onMouseDown: onPressIn,
          onMouseUp: onPressOut,
          onTouchStart: onPressIn,
          onTouchEnd: onPressOut,
          style: {
            cursor: disabled ? 'default' : 'pointer',
            border: 'none',
            background: 'none',
            padding: 0,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            ...style,
          },
          disabled,
        },
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
    useWindowDimensions: vi.fn(() => ({ width: 375, height: 812 })),
    Alert: {
      alert: vi.fn(),
    },
    Modal: ({ visible, children }: any) => (visible ? children : null),
    ActivityIndicator: ({ testID, size, color }: any) =>
      React.createElement('div', { 'data-testid': testID, style: { color } }, `Loading ${size}`),
    AppState: {
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
      currentState: 'active',
    },
    SafeAreaView: ({ children, style }: any) => React.createElement('div', { style }, children),
  };
});

// Mock expo-router
vi.mock('expo-router', () => ({
  useRouter: vi.fn(() => routerMock),
  useLocalSearchParams: vi.fn(() => ({})),
  useSegments: vi.fn(() => []),
  Link: ({ children }: any) => children,
  Stack: Object.assign(({ children }: any) => children, {
    Screen: vi.fn(({ options }: any) => {
      if (options?.headerRight) {
        const HeaderRight = options.headerRight;
        return React.createElement(
          'div',
          { 'data-testid': 'header-right' },
          typeof HeaderRight === 'function' ? React.createElement(HeaderRight, null) : HeaderRight,
        );
      }
      return null;
    }),
  }),
  Tabs: ({ children }: any) => children,
}));

// Mock useColorScheme from components
vi.mock('@/components/useClientOnlyValue', () => ({
  useClientOnlyValue: vi.fn((light: any, dark: any) => light),
}));
vi.mock('@/components/useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

// Mock Lucide icons
vi.mock('lucide-react-native', () => {
  const mockIcon = (name: string) => {
    const Icon = (props: any) =>
      React.createElement('div', { ...props, 'data-testid': `icon-${name}` }, name);
    Icon.displayName = `Icon(${name})`;
    return Icon;
  };
  return {
    __esModule: true,
    Sparkles: mockIcon('Sparkles'),
    Utensils: mockIcon('Utensils'),
    Box: mockIcon('Box'),
    CheckCircle2: mockIcon('CheckCircle2'),
    HelpCircle: mockIcon('HelpCircle'),
    Gift: mockIcon('Gift'),
    Plus: mockIcon('Plus'),
    Settings: mockIcon('Settings'),
    Trash2: mockIcon('Trash2'),
    Edit2: mockIcon('Edit2'),
    Check: mockIcon('Check'),
    X: mockIcon('X'),
    WifiOff: mockIcon('WifiOff'),
    History: mockIcon('History'),
    Activity: mockIcon('Activity'),
    Shield: mockIcon('Shield'),
    Star: mockIcon('Star'),
    ChevronLeft: mockIcon('ChevronLeft'),
    Volume2: mockIcon('Volume2'),
    VolumeX: mockIcon('VolumeX'),
    Bolt: mockIcon('Bolt'),
    Trash: mockIcon('Trash'),
    Edit: mockIcon('Edit'),
    Circle: mockIcon('Circle'),
    ChevronRight: mockIcon('ChevronRight'),
    Calendar: mockIcon('Calendar'),
    Clock: mockIcon('Clock'),
    Award: mockIcon('Award'),
    User: mockIcon('User'),
    LogOut: mockIcon('LogOut'),
    Home: mockIcon('Home'),
    Info: mockIcon('Info'),
    ArrowLeft: mockIcon('ArrowLeft'),
    Search: mockIcon('Search'),
    Filter: mockIcon('Filter'),
    CheckCircle: mockIcon('CheckCircle'),
    Zap: mockIcon('Zap'),
    RefreshCw: mockIcon('RefreshCw'),
    ClipboardList: mockIcon('ClipboardList'),
    Cloud: mockIcon('Cloud'),
    CloudOff: mockIcon('CloudOff'),
    AlertCircle: mockIcon('AlertCircle'),
    RefreshCcw: mockIcon('RefreshCcw'),
  };
});
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

// Mock expo-audio
vi.mock('expo-audio', () => ({
  createAudioPlayer: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    remove: vi.fn(),
    addListener: vi.fn(() => ({ remove: vi.fn() })),
    volume: 1.0,
    loop: false,
  })),
  AudioModule: {},
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
vi.mock('react-native-svg', () => {
  const MockSVG = ({ children }: any) => children;
  return {
    Svg: MockSVG,
    Circle: MockSVG,
    G: MockSVG,
    Path: MockSVG,
    Rect: MockSVG,
    Ellipse: MockSVG,
    Defs: MockSVG,
    Pattern: MockSVG,
    LinearGradient: MockSVG,
    Stop: MockSVG,
    default: MockSVG,
  };
});

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
    FadeIn: vi.fn(),
    FadeOut: vi.fn(),
    ZoomIn: vi.fn(),
    ZoomOut: vi.fn(),
  };
  return {
    ...Reanimated,
    default: Reanimated,
    Animated: Reanimated,
  };
});

// Mock @expo/vector-icons
vi.mock('@expo/vector-icons', () => {
  return {
    MaterialCommunityIcons: (props: any) =>
      React.createElement('div', { ...props, 'data-testid': 'icon-material-community' }),
    Ionicons: (props: any) =>
      React.createElement('div', { ...props, 'data-testid': 'icon-ionicons' }),
    FontAwesome: (props: any) =>
      React.createElement('div', { ...props, 'data-testid': 'icon-fontawesome' }),
  };
});

// Mock react-native-error-boundary
vi.mock('react-native-error-boundary', () => {
  class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }
    componentDidCatch(error: any, errorInfo: any) {
      this.props.onError?.(error, errorInfo.componentStack);
    }
    resetError = () => {
      this.setState({ hasError: false, error: null });
    };
    render() {
      if (this.state.hasError) {
        return React.createElement(this.props.FallbackComponent, {
          error: this.state.error,
          resetError: this.resetError,
        });
      }
      return this.props.children;
    }
  }
  return {
    __esModule: true,
    default: ErrorBoundary,
  };
});

// Mock network service
vi.mock('@/lib/network', () => ({
  networkService: {
    isOnline: vi.fn(() => Promise.resolve(true)),
    subscribeToConnectionChange: vi.fn(() => vi.fn()),
  },
  checkIsOnline: vi.fn(() => Promise.resolve(true)),
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

// Mock Supabase lib
vi.mock('@/lib/supabase', () => {
  const mock: any = {
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
    from: vi.fn(function (this: any) {
      return this;
    }),
    select: vi.fn(function (this: any) {
      return this;
    }),
    insert: vi.fn(function (this: any) {
      return this;
    }),
    update: vi.fn(function (this: any) {
      return this;
    }),
    upsert: vi.fn(function (this: any) {
      return this;
    }),
    delete: vi.fn(function (this: any) {
      return this;
    }),
    eq: vi.fn(function (this: any) {
      return this;
    }),
    or: vi.fn(function (this: any) {
      return this;
    }),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
  };
  return {
    supabase: mock,
    withTimeout: vi.fn((promise) => promise),
    SUPABASE_TIMEOUT: 10000,
  };
});

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => createSupabaseMock()),
}));
// Set dummy env vars for Supabase initialization in tests
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
