// import { Assets as NavigationAssets } from '@react-navigation/elements'
// import { Asset } from 'expo-asset'
// import * as SplashScreen from "expo-splash-screen";
import './styles/global.css';
import * as React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';

// Asset.loadAsync([
//   ...NavigationAssets,
//   require('./assets/newspaper.png'),
//   require('./assets/bell.png')
// ])

// SplashScreen.preventAutoHideAsync();

export function App() {
  const [fontsLoaded] = useFonts({
    'SFProDisplay-Light': require('./assets/fonts/SF-Pro-Display-Light.otf')
    //'SFProDisplay-Bold': require('./assets/fonts/SF-Pro-Display-Bold.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigator />;
}
