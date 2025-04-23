import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import ScreenName from 'src/domains/shared/constants/screenNames';
import { MeditationSession } from 'src/data/storage.types';

// === Stack Navigator (NavigationContainer) ===
export type StackParamList = {
  [ScreenName.MAIN_TABS]: undefined;
  [ScreenName.MEDITATION_TIMER]: { durationSeconds: number };
  [ScreenName.MEDITATION_SUMMARY]: { meditationSession: MeditationSession };
  [ScreenName.MEDITATION_DETAIL]: { meditationSession: MeditationSession };
  [ScreenName.QUOTE_MANAGER]: undefined;
};

// === Top Tabs Navigator (dans MAIN_TABS) ===
export type TopTabParamList = {
  [ScreenName.SETTINGS]: undefined;
  [ScreenName.ACTIVITY]: undefined;
  [ScreenName.HOME]: undefined;
  [ScreenName.CALENDAR]: undefined;
  [ScreenName.PIXEL_YEAR]: undefined;
};

// === Navigation Prop combinée pour les écrans de TabNavigator ===
export type TabScreenNavigationProp<Screen extends keyof TopTabParamList> = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TopTabParamList, Screen>,
  NativeStackNavigationProp<StackParamList>
>;
