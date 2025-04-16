import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import ScreenName from 'src/domains/shared/constants/screenNames';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { StackParamList } from 'src/app/navigation/AppNavigator';
import { MeditationSession } from 'src/data/storage.types';
import MeditationDetail from '../components/MeditationDetail';

type MeditationSummaryProps = StackScreenProps<StackParamList, ScreenName.MEDITATION_SUMMARY>;

const MeditationSummaryScreen = ({ route }: MeditationSummaryProps) => {
  const { meditationSession }: { meditationSession: MeditationSession } = route.params || {
    meditationSession: {}
  };

  return (
    <ScreenLayout title="Résumé">
      <MeditationDetail meditationSession={meditationSession} mode="summary" />
    </ScreenLayout>
  );
};

export default MeditationSummaryScreen;
