import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmationModal } from 'src/components/ConfirmationModal';
import CustomText from 'src/components/CustomText';
import useSessionTimer from 'src/hooks/useSessionTimer';
import { PALETTE } from 'src/theme/palette';
import { Play, Pause, Square } from 'lucide-react-native';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const SessionScreen = ({ navigation, route }) => {
  const { duration } = route.params || { duration: 10 };
  const { timeLeft, isRunning, start, pause } = useSessionTimer(duration * 60);
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  const handleScreenPress = () => {
    if (isRunning) {
      setCounter((prevCounter) => prevCounter + 1);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
        <TouchableWithoutFeedback onPress={handleScreenPress}>
          <View className="flex-1 p-10 bg-platinium">
            <View className="flex-1 justify-center items-center mt-10">
              <CustomText className="text-5xl font-bold text-gray-600">{counter}</CustomText>
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
            action: () => setModalVisible(false),
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

export default SessionScreen;
