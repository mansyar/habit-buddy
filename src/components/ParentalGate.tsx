import React, { useRef } from 'react';
import { Pressable } from 'react-native';

interface ParentalGateProps {
  onSuccess: () => void;
  children: React.ReactNode;
  delay?: number;
}

export function ParentalGate({ onSuccess, children, delay = 3000 }: ParentalGateProps) {
  const timerRef = useRef<any>(null);

  const handlePressIn = () => {
    timerRef.current = setTimeout(() => {
      onSuccess();
      timerRef.current = null;
    }, delay);
  };

  const handlePressOut = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ minHeight: 48, minWidth: 48, justifyContent: 'center', alignItems: 'center' }}
      accessibilityLabel="Long press for parents"
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
}
