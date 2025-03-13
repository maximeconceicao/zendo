import { View, FlatList } from 'react-native';
import CustomText from './CustomText';
import { MeditationSession } from 'src/types/storage.types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetter } from 'src/utils/common.utils';

const MeditationList = ({ sessions }: { sessions: MeditationSession[] }) => {
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
        <View style={{ marginBottom: 10 }}>
          <CustomText className="text-lg font-bold">
            {capitalizeFirstLetter(
              format(new Date(item.date), "EEEE dd/MM à HH':'mm", { locale: fr })
            )}
          </CustomText>
          <CustomText className="text-sm mt-2">{item.actualDurationSeconds} secondes</CustomText>
        </View>
      )}
    />
  );
};

export default MeditationList;
