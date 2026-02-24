import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

const MockSignIn = () => (
  <View>
    <Text>Sign in with Google</Text>
    <Text>Continue as Guest</Text>
  </View>
);

describe('Minimal Test', () => {
  test('renders text', () => {
    const { getByText } = render(<MockSignIn />);
    expect(getByText('Sign in with Google')).toBeTruthy();
  });
});
