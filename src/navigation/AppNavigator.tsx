import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CountdownScreen from 'src/screens/CountdownScreen';
import { StatusBar } from 'react-native';
import SessionScreen from 'src/screens/SessionScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="HomeStack"
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: { height: 0 },
      swipeEnabled: true
    }}
  >
    <Tab.Screen name="HomeStack" component={HomeScreen} />
    <Tab.Screen name="Countdown" component={CountdownScreen} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

// Stack Global qui englobe Tabs + Session
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Session" component={SessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
