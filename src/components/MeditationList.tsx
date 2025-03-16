import { View, FlatList, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { MeditationSession } from 'src/types/storage.types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetter } from 'src/utils/common.utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from 'src/navigation/AppNavigator';
import ScreenName from 'src/constants/screenNames';
import { MeditationFeeling } from 'src/constants/session.constants';
import { Smile, Meh, Frown } from 'lucide-react-native';

const feelingIcons = {
  [MeditationFeeling.Good]: Smile,
  [MeditationFeeling.Neutral]: Meh,
  [MeditationFeeling.Bad]: Frown
};

const FeelingIcon = ({ feeling }: { feeling: MeditationFeeling }) => {
  const Icon = feelingIcons[feeling] || Meh; // Icône par défaut si feeling est invalide
  return <Icon size={24} color="black" />;
};

const MeditationList = ({ sessions }: { sessions: MeditationSession[] }) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id + Math.floor(Math.random() * 100)}
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
      ListEmptyComponent={
        <CustomText className="text-base mt-2 text-gray-500">
          Aucune méditation enregistrée.
        </CustomText>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ScreenName.MEDITATION_DETAIL, { meditationSession: item })
          }
          style={{ marginBottom: 10 }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-col justify-between">
              <CustomText className="text-lg" bold>
                {capitalizeFirstLetter(
                  format(new Date(item.date), "EEEE dd/MM à HH':'mm", { locale: fr })
                )}
              </CustomText>
              <CustomText className="text-sm mt-2">
                {item.actualDurationSeconds < 60
                  ? `${item.actualDurationSeconds} secondes`
                  : `${Math.floor(item.actualDurationSeconds / 60)} minutes`}
              </CustomText>
            </View>
            <FeelingIcon feeling={item.feeling} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default MeditationList;
