import React, { useRef, useState } from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';

interface ParentalGateProps {
  onSuccess: () => void;
  children: React.ReactNode;
}

export function ParentalGate({ onSuccess, children }: ParentalGateProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    timerRef.current = setTimeout(() => {
      onSuccess();
      timerRef.current = null;
    }, 3000);
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
