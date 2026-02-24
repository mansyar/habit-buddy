import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />
      <Text style={styles.title}>Settings</Text>
      <Text>Settings and Parent Controls will be here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Fredoka-One',
    marginBottom: 10,
  },
});
