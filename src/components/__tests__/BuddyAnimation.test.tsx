import React from 'react';
import { render } from '@testing-library/react';
import { BuddyAnimation } from '../BuddyAnimation';
import { describe, it, expect } from 'vitest';

describe('BuddyAnimation', () => {
  it('renders dino buddy correctly', () => {
    const { getByTestId } = render(<BuddyAnimation buddy="dino" state="idle" />);
    expect(getByTestId('buddy-animation')).toBeTruthy();
  });

  it('renders bear buddy correctly', () => {
    const { getByTestId } = render(<BuddyAnimation buddy="bear" state="active" />);
    expect(getByTestId('buddy-animation')).toBeTruthy();
  });

  it('renders correctly in different states', () => {
    const { rerender, getByTestId } = render(<BuddyAnimation buddy="dino" state="idle" />);
    expect(getByTestId('buddy-animation')).toBeTruthy();

    rerender(<BuddyAnimation buddy="dino" state="success" />);
    expect(getByTestId('buddy-animation')).toBeTruthy();

    rerender(<BuddyAnimation buddy="dino" state="sleepy" />);
    expect(getByTestId('buddy-animation')).toBeTruthy();
  });
});
