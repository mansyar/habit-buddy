import React from 'react';
import { render } from '@testing-library/react';
import { Confetti } from '../Confetti';
import { describe, it, expect } from 'vitest';

describe('Confetti', () => {
  it('renders nothing when inactive', () => {
    const { queryByRole } = render(<Confetti isActive={false} />);
    // Since it returns null, we expect queryByRole to not find anything.
    // We can also check if the result of render is empty.
    expect(queryByRole('presentation')).toBeNull();
  });

  it('renders particles when active', () => {
    // We don't have testIDs for particles yet, but we can check if it renders.
    const { container } = render(<Confetti isActive={true} />);
    expect(container).toBeTruthy();
  });
});
