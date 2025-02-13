// import { Assets as NavigationAssets } from '@react-navigation/elements'
// import { Asset } from 'expo-asset'
// import * as SplashScreen from "expo-splash-screen";
import * as React from 'react'
import AppNavigator from './navigation/AppNavigator'

// Asset.loadAsync([
//   ...NavigationAssets,
//   require('./assets/newspaper.png'),
//   require('./assets/bell.png')
// ])

// SplashScreen.preventAutoHideAsync();

export function App() {
  return <AppNavigator />
}
