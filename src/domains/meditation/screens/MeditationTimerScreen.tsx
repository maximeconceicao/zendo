import { Pause, Play, Square } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmationModal } from 'src/domains/shared/components/ConfirmationModal';
import CustomText from 'src/domains/shared/components/CustomText';
import FocusPointCounter from 'src/domains/meditation/components/FocusPointCounter';
import ScreenName from 'src/domains/shared/constants/screenNames';
import {
  END_SESSION_VIBRATION_PATTERN,
  FOCUS_VIBRATION_PATTERN,
  MeditationFeeling,
  START_SESSION_VIBRATION_PATTERN
} from 'src/domains/meditation/constants/session.constants';
import { useAppData } from 'src/store/useAppData';
import useSessionTimer from 'src/domains/meditation/hooks/useSessionTimer';
import { PALETTE } from 'src/theme/palette';
import { MeditationSession } from 'src/data/storage.types';
import { useKeepAwake } from 'expo-keep-awake';
import { useSoundPlayer } from 'src/domains/shared/hooks/useSoundPlayer';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from 'src/app/navigation/navigation.types';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${seconds < 0 ? '+' : ''}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const MeditationTimerScreen = ({ route }) => {
  useKeepAwake();
  const { durationSeconds } = route.params || { duration: 10 };

  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { userSettings, addSession } = useAppData();
  const { playSound } = useSoundPlayer();

  const { timeLeft, elapsedTime, isRunning, start, pause } = useSessionTimer(durationSeconds);
  const [modalVisible, setModalVisible] = useState(false);

  const [meditationSession, setMeditationSession] = useState<MeditationSession>({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    focusPoints: [],
    plannedDurationSeconds: durationSeconds,
    actualDurationSeconds: 0,
    feeling: MeditationFeeling.Neutral
  });

  const handleScreenPress = () => {
    if (isRunning) {
      if (userSettings.vibrateOnFocus) {
        Vibration.vibrate(FOCUS_VIBRATION_PATTERN);
      }
      if (userSettings.soundOnFocus) {
        playSound(userSettings.soundTypeOnFocus);
      }
      setMeditationSession((prev) => ({
        ...prev,
        focusPoints: [...prev.focusPoints, { elapsedTime }]
      }));
    }
  };

  useEffect(() => {
    if (userSettings.vibrateOnSessionStart) {
      Vibration.vibrate(START_SESSION_VIBRATION_PATTERN);
    }
    if (userSettings.soundOnSessionStart) {
      playSound(userSettings.soundTypeOnSessionStart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (userSettings.vibrateOnSessionEnd) {
        Vibration.vibrate(END_SESSION_VIBRATION_PATTERN);
      }
      if (userSettings.soundOnSessionEnd) {
        playSound(userSettings.soundTypeOnSessionEnd);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <View className="flex-1 p-10 bg-platinium">
            <View className="flex-1 justify-center items-center ">
              {/* Hack : here we hide the counter so Animated.view doesn't interfere with ConfirmationModal */}
              {!modalVisible && (
                <FocusPointCounter
                  count={meditationSession.focusPoints.length}
                  isAnimating={isRunning}
                />
              )}
            </View>

            <View className="items-center pb-10">
              <CustomText className="text-2xl font-bold text-gray-800 mb-6">
                {formatTime(timeLeft)}
              </CustomText>

              <View className="flex-row gap-4 w-full justify-evenly">
                <TouchableOpacity
                  onPress={() => {
                    pause();
                    setModalVisible(true);
                  }}
                  className="w-14 h-14 border-solid border-black border-2 rounded-full items-center justify-center"
                >
                  <Square size={24} fill="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={isRunning ? pause : start}
                  className="w-14 h-14 bg-black rounded-full items-center justify-center"
                >
                  {isRunning ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Terminer la session ?"
        options={[
          {
            label: 'Reprendre',
            action: () => {
              setModalVisible(false);
              start();
            },
            style: 'text-black text-xl text-center'
          },
          {
            label: 'Enregistrer',
            action: () => {
              const session = { ...meditationSession, actualDurationSeconds: elapsedTime };
              addSession(session);
              setModalVisible(false);
              navigation.navigate(ScreenName.MEDITATION_SUMMARY, {
                meditationSession: session
              });
            },
            style: 'text-black text-xl text-center'
          },
          {
            label: 'Quitter',
            action: () => {
              setModalVisible(false);
              navigation.goBack();
            },
            style: 'text-red-500 text-xl text-center'
          }
        ]}
      />
    </>
  );
};

export default MeditationTimerScreen;
