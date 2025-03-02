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

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

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
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenName.MAIN_TABS} component={MainTabs} />
        <Stack.Screen name={ScreenName.MEDITATION_TIMER} component={MeditationTimerScreen} />
        <Stack.Screen name={ScreenName.MEDITATION_SUMMARY} component={MeditationSummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
