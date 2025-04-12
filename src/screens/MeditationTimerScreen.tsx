import { Pause, Play, Square } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmationModal } from 'src/components/ConfirmationModal';
import CustomText from 'src/components/CustomText';
import FocusPointCounter from 'src/components/FocusPointCounter';
import ScreenName from 'src/constants/screenNames';
import {
  FOCUS_VIBRATION_PATTERN,
  MeditationFeeling,
  START_SESSION_VIBRATION_PATTERN
} from 'src/constants/session.constants';
import { useAppData } from 'src/hooks/useAppData';
import useSessionTimer from 'src/hooks/useSessionTimer';
import { PALETTE } from 'src/theme/palette';
import { MeditationSession } from 'src/types/storage.types';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const MeditationTimerScreen = ({ navigation, route }) => {
  const { durationSeconds } = route.params || { duration: 10 };

  const { userSettings, addSession } = useAppData();

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
      if (userSettings?.vibrateOnFocus) {
        Vibration.vibrate(FOCUS_VIBRATION_PATTERN);
      }
      setMeditationSession((prev) => ({
        ...prev,
        focusPoints: [...prev.focusPoints, { elapsedTime }]
      }));
    }
  };

  useEffect(() => {
    if (userSettings?.vibrateOnSessionStart) {
      Vibration.vibrate(START_SESSION_VIBRATION_PATTERN);
    }
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <View className="flex-1 p-10 bg-platinium">
            <View className="flex-1 justify-center items-center ">
              {/* Here we hide the counter so Animated.view doesn't interfere with ConfirmationModal */}
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
                  className="border-solid border-black border-2 p-4 rounded-full"
                >
                  <Square size={24} fill="black" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={isRunning ? pause : start}
                  className="bg-black p-4 rounded-full"
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
            style: 'text-blue-500 text-xl text-center'
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
            style: 'text-blue-500 text-xl text-center'
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
