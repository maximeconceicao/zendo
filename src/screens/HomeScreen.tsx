import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomText from 'src/components/CustomText';
import ScreenName from 'src/constants/screenNames';
import DailyQuote from 'src/components/DailyQuote';
import ScreenLayout from 'src/layouts/ScreenLayout';
import { Hourglass } from 'lucide-react-native';
import { useAppData } from 'src/hooks/useAppData';

const HomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { meditationQuotes } = useAppData();

  const formattedDuration = useMemo(() => {
    const durationInMinutes = selectedDate.getHours() * 60 + selectedDate.getMinutes();
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
  }, [selectedDate]);

  const onChange = (event, date) => {
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
        <DailyQuote quotes={meditationQuotes || []} />
      </View>

      <Pressable
        className="flex-row justify-between items-center p-4"
        onPress={() => setShowPicker(true)}
      >
        <View className="flex-row items-center">
          <Hourglass size={20} color="black" />
          <CustomText className="text-base pl-3">DURÉE</CustomText>
        </View>

        <CustomText className="text-base">{formattedDuration}</CustomText>

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
          onPress={() =>
            navigation.navigate(ScreenName.MEDITATION_TIMER, {
              durationSeconds: selectedDate.getHours() * 3600 + selectedDate.getMinutes() * 60
            })
          }
        >
          <CustomText className="text-white text-center text-lg">Démarrer la méditation</CustomText>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default HomeScreen;
