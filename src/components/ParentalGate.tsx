import React, { useRef, useState } from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';

interface ParentalGateProps {
  onSuccess: () => void;
  children: React.ReactNode;
  delay?: number;
}

export function ParentalGate({ onSuccess, children, delay = 3000 }: ParentalGateProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {children}
    </Pressable>
  );
}
