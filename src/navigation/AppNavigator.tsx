import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { StatusBar } from 'react-native';
import SessionScreen from 'src/screens/SessionScreen';
import ScreenName from 'src/constants/screenNames';

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
    <Tab.Screen name="Settings" component={SettingsScreen} />
    <Tab.Screen name="HomeStack" component={HomeScreen} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
  </Tab.Navigator>
);

// Stack Global qui englobe Tabs + Session
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenName.MAIN_TABS} component={MainTabs} />
        <Stack.Screen name={ScreenName.SESSION} component={SessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
