import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { StatusBar } from 'react-native';
import ScreenName from 'src/constants/screenNames';
import MeditationTimerScreen from 'src/screens/MeditationTimerScreen';
import ActivityScreen from '../screens/ActivityScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MeditationSummaryScreen from 'src/screens/MeditationSummaryScreen';
import CalendarScreen from 'src/screens/CalendarScreen';
import PixelYearScreen from 'src/screens/PixelYearScreen';
import { MeditationSession } from 'src/types/storage.types';
import MeditationDetailScreen from 'src/screens/MeditationDetailScreen';
import QuoteManagerScreen from 'src/screens/QuoteManagerScreen';

export type StackParamList = {
  [ScreenName.MAIN_TABS]: undefined;
  [ScreenName.MEDITATION_TIMER]: undefined;
  [ScreenName.MEDITATION_SUMMARY]: { meditationSession: MeditationSession };
  [ScreenName.MEDITATION_DETAIL]: { meditationSession: MeditationSession };
  [ScreenName.QUOTE_MANAGER]: undefined;
};

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator<StackParamList>();

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName={ScreenName.HOME}
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: { height: 0 },
      swipeEnabled: true
    }}
  >
    <Tab.Screen name={ScreenName.SETTINGS} component={SettingsScreen} />
    <Tab.Screen name={ScreenName.ACTIVITY} component={ActivityScreen} />
    <Tab.Screen name={ScreenName.HOME} component={HomeScreen} />
    <Tab.Screen name={ScreenName.CALENDAR} component={CalendarScreen} />
    <Tab.Screen name={ScreenName.PIXEL_YEAR} component={PixelYearScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <StatusBar hidden /> */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenName.MAIN_TABS} component={MainTabs} />
        <Stack.Screen
          name={ScreenName.MEDITATION_TIMER}
          component={MeditationTimerScreen}
          options={
            {
              //...TransitionPresets.ModalFadeTransition
            }
          }
        />
        <Stack.Screen name={ScreenName.MEDITATION_SUMMARY} component={MeditationSummaryScreen} />
        <Stack.Screen name={ScreenName.MEDITATION_DETAIL} component={MeditationDetailScreen} />
        <Stack.Screen name={ScreenName.QUOTE_MANAGER} component={QuoteManagerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
