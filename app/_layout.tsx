
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { useFonts, Baloo2_400Regular, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { View, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function RootLayout() {
  useEffect(() => {
    setupErrorLogging();
  }, []);

  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      />
    </SafeAreaProvider>
  );
}
