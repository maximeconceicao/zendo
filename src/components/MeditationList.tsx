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
          <View>
            <CustomText className="text-lg" bold>
              {capitalizeFirstLetter(
                format(new Date(item.date), "EEEE dd/MM à HH':'mm", { locale: fr })
              )}
            </CustomText>
            <CustomText className="text-sm mt-2">{item.actualDurationSeconds} secondes</CustomText>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default MeditationList;
