import { View, FlatList, TouchableOpacity } from 'react-native';
import CustomText from '../../shared/components/CustomText';
import { MeditationSession } from 'src/data/storage.types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetter } from 'src/domains/shared/utils/common.utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenName from 'src/domains/shared/constants/screenNames';
import { MeditationFeeling } from 'src/domains/meditation/constants/session.constants';
import { Smile, Meh, Frown } from 'lucide-react-native';
import { StackParamList } from 'src/app/navigation/navigation.types';

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

  const sessionCount = sessions.length;

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id + Math.floor(Math.random() * 100)}
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 0, paddingTop: 0 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        sessionCount > 0 ? (
          <CustomText className="text-base text-gray-500 my-5">
            Méditation ({sessionCount})
          </CustomText>
        ) : null
      }
      ListEmptyComponent={
        <CustomText className="text-base mt-5 text-gray-500">
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
