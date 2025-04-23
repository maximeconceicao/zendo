import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import CustomText from 'src/domains/shared/components/CustomText';
import FeelingSelector from 'src/domains/meditation/components/FeelingSelector';
import ScreenName from 'src/domains/shared/constants/screenNames';
import { MeditationFeeling } from 'src/domains/meditation/constants/session.constants';
import { useAppData } from 'src/store/useAppData';
import { MeditationSession } from 'src/data/storage.types';
import FocusChart from 'src/domains/meditation/components/FocusChart';
import { StackParamList } from 'src/app/navigation/navigation.types';

type MeditationDetailMode = 'summary' | 'detail';

const MeditationDetail = ({
  meditationSession,
  mode = 'detail'
}: {
  meditationSession: MeditationSession;
  mode?: MeditationDetailMode;
}) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { updateSession } = useAppData();

  const [selectedFeeling, setSelectedFeeling] = useState<MeditationFeeling>(
    meditationSession.feeling || MeditationFeeling.Neutral
  );

  const focusPoints = meditationSession.focusPoints || [];
  const durationSeconds = meditationSession.actualDurationSeconds || 0;
  const durationMinutes = Math.ceil(durationSeconds / 60);

  const durationDisplay =
    durationSeconds < 60
      ? `${durationSeconds} secondes`
      : `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;

  return (
    <View>
      <View className="my-4">
        <CustomText className="text-lg text-center">Durée :</CustomText>
        <CustomText className="text-3xl font-semibold text-center">{durationDisplay}</CustomText>
      </View>

      <View className="my-4">
        <CustomText className="text-lg text-center">Recentrages :</CustomText>
        <CustomText className="text-3xl font-semibold text-center">{focusPoints.length}</CustomText>
      </View>

      {focusPoints.length > 0 && (
        <FocusChart focusPoints={focusPoints} durationMinutes={durationMinutes} />
      )}

      <FeelingSelector
        selectedFeeling={selectedFeeling}
        onSelect={(feeling: MeditationFeeling) => {
          updateSession({ ...meditationSession, feeling });
          setSelectedFeeling(feeling);
        }}
      />

      <View className="p-6 mt-auto">
        <TouchableOpacity
          className="bg-black p-4 rounded-lg"
          onPress={() => {
            if (mode === 'summary') {
              navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.MAIN_TABS }]
              });
            } else {
              navigation.goBack();
            }
          }}
        >
          <CustomText className="text-white text-center text-lg">
            {mode === 'summary' ? 'OK' : 'Retour'}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MeditationDetail;
