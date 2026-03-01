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

  it('calls onPressIn when pressed down', () => {
    const onPressIn = vi.fn();
    const { getByText } = render(
      <ScaleButton onPressIn={onPressIn}>
        <Text>Click Me</Text>
      </ScaleButton>,
    );

    fireEvent.mouseDown(getByText('Click Me'));
    expect(onPressIn).toHaveBeenCalled();
  });

  it('calls onPressOut when released', () => {
    const onPressOut = vi.fn();
    const { getByText } = render(
      <ScaleButton onPressOut={onPressOut}>
        <Text>Click Me</Text>
      </ScaleButton>,
    );

    fireEvent.mouseUp(getByText('Click Me'));
    expect(onPressOut).toHaveBeenCalled();
  });
});
