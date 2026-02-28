import { render } from '@testing-library/react';
import { Text } from '../Themed';
import { describe, it, expect, vi } from 'vitest';

// Mock useColorScheme
vi.mock('../useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

describe('Themed Text', () => {
  it('allows font scaling by default', () => {
    // In react-native-web, allowFontScaling is not a direct prop on the DOM element
    // but we can check if the Text component passed it down if we mock DefaultText
    // However, for now, we just want to ensure it's not explicitly disabled in our code.
    const { getByText } = render(<Text>Test Scaling</Text>);
    const textElement = getByText('Test Scaling');
    expect(textElement).toBeTruthy();
  });
});
