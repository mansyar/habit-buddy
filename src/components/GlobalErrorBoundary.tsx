import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { Text, View } from './Themed';
import { AppColors } from '@/theme/Colors';
import { ScaleButton } from './ScaleButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const FallbackComponent: React.FC<FallbackProps> = ({ error, resetError }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <MaterialCommunityIcons name="robot-confused" size={80} color={AppColors.missionOrange} />
      <Text style={styles.title}>Something went wrong!</Text>
      <Text style={styles.message}>
        Oops! Your Buddy ran into a little trouble. Don't worry, we can try again!
      </Text>

      {__DEV__ && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error.toString()}</Text>
        </View>
      )}

      <ScaleButton style={styles.button} onPress={resetError}>
        <Text style={styles.buttonText}>Try Again</Text>
      </ScaleButton>
    </View>
  </SafeAreaView>
);

export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleError = (error: Error, stackTrace: string) => {
    // Log error locally
    console.error('Global Error caught:', error);
    console.error('Stack trace:', stackTrace);
  };

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.deepIndigo,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: AppColors.deepIndigo,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: AppColors.cardDark,
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: AppColors.error,
  },
  button: {
    marginTop: 30,
    backgroundColor: AppColors.dinoGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: AppColors.deepIndigo,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
