import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';

export default function RewardShopScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Reward Shop', headerShown: true }} />
      <Text style={styles.title}>Reward Shop</Text>
      <Text>Trade your Gold Bolts for awesome prizes here!</Text>
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
