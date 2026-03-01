import React from 'react';
import { Tabs } from 'expo-router';
import { Home } from 'lucide-react-native';

import { Colors } from '@/theme/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Missions',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
