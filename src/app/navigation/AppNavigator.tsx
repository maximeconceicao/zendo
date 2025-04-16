import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ScreenName from 'src/domains/shared/constants/screenNames';
import CalendarScreen from 'src/domains/timeline/screens/CalendarScreen';
import MeditationDetailScreen from 'src/domains/meditation/screens/MeditationDetailScreen';
import MeditationSummaryScreen from 'src/domains/meditation/screens/MeditationSummaryScreen';
import MeditationTimerScreen from 'src/domains/meditation/screens/MeditationTimerScreen';
import PixelYearScreen from 'src/domains/timeline/screens/PixelYearScreen';
import QuoteManagerScreen from 'src/domains/quotes/screens/QuoteManagerScreen';
import { MeditationSession } from 'src/data/storage.types';
import ActivityScreen from '../../domains/activity/screens/ActivityScreen';
import HomeScreen from '../../domains/meditation/screens/HomeScreen';
import SettingsScreen from '../../domains/settings/screens/SettingsScreen';

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
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name={ScreenName.MAIN_TABS} component={MainTabs} />
        <Stack.Screen name={ScreenName.MEDITATION_TIMER} component={MeditationTimerScreen} />
        <Stack.Screen name={ScreenName.MEDITATION_SUMMARY} component={MeditationSummaryScreen} />
        <Stack.Screen name={ScreenName.MEDITATION_DETAIL} component={MeditationDetailScreen} />
        <Stack.Screen name={ScreenName.QUOTE_MANAGER} component={QuoteManagerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
