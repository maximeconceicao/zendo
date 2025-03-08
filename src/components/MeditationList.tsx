import { View, FlatList } from 'react-native';
import CustomText from './CustomText';
import { MeditationSession } from 'src/types/storage.types';

const MeditationList = ({ sessions }: { sessions: MeditationSession[] }) => {
  console.log('sessions', sessions);

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id + Math.floor(Math.random() * 100)}
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
      ListEmptyComponent={
        <CustomText className="text-sm mt-2 text-gray-500">
          Aucune méditation enregistrée.
        </CustomText>
      }
      renderItem={({ item }) => (
        <View style={{ marginBottom: 10 }}>
          <CustomText className="text-lg font-bold">
            {new Date(item.date).toDateString()}
          </CustomText>
          <CustomText className="text-sm mt-2">{item.actualDurationSeconds} secondes</CustomText>
        </View>
      )}
    />
  );
};

export default MeditationList;
