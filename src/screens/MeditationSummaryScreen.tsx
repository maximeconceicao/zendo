import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import MeditationDetail from 'src/components/MeditationDetail';
import ScreenName from 'src/constants/screenNames';
import ScreenLayout from 'src/layouts/ScreenLayout';
import { StackParamList } from 'src/navigation/AppNavigator';
import { MeditationSession } from 'src/types/storage.types';

type MeditationSummaryProps = StackScreenProps<StackParamList, ScreenName.MEDITATION_SUMMARY>;

const MeditationSummaryScreen = ({ route }: MeditationSummaryProps) => {
  const { meditationSession }: { meditationSession: MeditationSession } = route.params || {
    meditationSession: {}
  };

  return (
    <ScreenLayout title="Résumé">
      <MeditationDetail meditationSession={meditationSession} />
    </ScreenLayout>
  );
};

export default MeditationSummaryScreen;
