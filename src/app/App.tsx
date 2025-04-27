import '../styles/global.css';
import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from '../store/AppDataContext';
import { initStorageIfFirstLaunch } from '../data/storage';

export function App() {
  React.useEffect(() => {
    initStorageIfFirstLaunch();
  }, []);

  const [fontsLoaded] = useFonts({
    'SFProDisplay-Light': require('../assets/fonts/SF-Pro-Display-Light.otf'),
    'SFProDisplay-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
    'SFProDisplay-Semibold': require('../assets/fonts/SF-Pro-Display-Semibold.otf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <AppNavigator />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
