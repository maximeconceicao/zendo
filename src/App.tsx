// import { Assets as NavigationAssets } from '@react-navigation/elements'
// import { Asset } from 'expo-asset'
// import * as SplashScreen from "expo-splash-screen";
import './styles/global.css';
import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './contexts/AppDataContext';
import { initStorageIfFirstLaunch } from './utils/storage';

// Asset.loadAsync([
//   ...NavigationAssets,
//   require('./assets/newspaper.png'),
//   require('./assets/bell.png')
// ])

// SplashScreen.preventAutoHideAsync();

export function App() {
  React.useEffect(() => {
    initStorageIfFirstLaunch();
  }, []);

  const [fontsLoaded] = useFonts({
    'SFProDisplay-Light': require('./assets/fonts/SF-Pro-Display-Light.otf'),
    'SFProDisplay-Bold': require('./assets/fonts/SF-Pro-Display-Bold.otf'),
    'SFProDisplay-Semibold': require('./assets/fonts/SF-Pro-Display-Semibold.otf')
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
