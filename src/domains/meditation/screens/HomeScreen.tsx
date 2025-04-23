import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, Platform, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CustomText from 'src/domains/shared/components/CustomText';
import ScreenName from 'src/domains/shared/constants/screenNames';
import DailyQuote from 'src/domains/quotes/components/DailyQuote';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { Hourglass } from 'lucide-react-native';
import { useAppData } from 'src/store/useAppData';
import { DEFAULT_SESSION_DURATION_SECONDS } from 'src/domains/meditation/constants/session.constants';
import { TabScreenNavigationProp } from 'src/app/navigation/navigation.types';

type HomeScreenProps = {
  navigation: TabScreenNavigationProp<typeof ScreenName.HOME>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { meditationQuotes, userSettings, updateUserSettings } = useAppData();

  const lastSelectedDurationSeconds =
    userSettings?.lastSelectedDurationSeconds || DEFAULT_SESSION_DURATION_SECONDS;

  useEffect(() => {
    const newDate = new Date();
    newDate.setHours(0, 0, lastSelectedDurationSeconds, 0);
    setSelectedDate(newDate);
  }, [lastSelectedDurationSeconds]);

  const formattedDuration = useMemo(() => {
    const durationInMinutes = selectedDate.getHours() * 60 + selectedDate.getMinutes();
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
  }, [selectedDate]);

  const onChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) {
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        date.setMinutes(5);
      }
      setSelectedDate(date);
    }
  };

  return (
    <ScreenLayout title="Carnet de Méditation">
      <View className="flex-1 justify-center">
        {userSettings?.showQuotes && meditationQuotes?.length && (
          <DailyQuote quotes={meditationQuotes || []} />
        )}
      </View>

      <Pressable
        className="flex-row justify-between items-center p-4"
        onPress={() => setShowPicker(true)}
      >
        <View className="flex-row items-center">
          <Hourglass size={20} color="black" />
          <CustomText className="text-base leading-5 pl-3">DURÉE</CustomText>
        </View>

        <CustomText className="text-base leading-5">{formattedDuration}</CustomText>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            minuteInterval={5}
            mode="time"
            display="spinner"
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </Pressable>

      <View className="border-b border-gray-300 mx-4 mb-2" />

      <View className="p-9">
        <TouchableOpacity
          className="bg-black p-4 rounded-lg"
          onPress={() => {
            const durationSeconds = selectedDate.getHours() * 3600 + selectedDate.getMinutes() * 60;

            if (durationSeconds !== lastSelectedDurationSeconds) {
              updateUserSettings({
                lastSelectedDurationSeconds: durationSeconds
              });
            }

            navigation.navigate(ScreenName.MEDITATION_TIMER, {
              durationSeconds
            });
          }}
        >
          <CustomText className="text-white text-center text-lg">Démarrer la méditation</CustomText>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default HomeScreen;
