import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ScaleButton } from '../ScaleButton';
import { Text } from 'react-native-web';
import { describe, it, expect, vi } from 'vitest';

describe('ScaleButton', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ScaleButton onPress={() => {}}>
        <Text>Click Me</Text>
      </ScaleButton>,
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <ScaleButton onPress={onPress}>
        <Text>Click Me</Text>
      </ScaleButton>,
    );

    fireEvent.click(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });
});
