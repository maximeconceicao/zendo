import { View } from 'react-native';
import CustomText from './CustomText';
import { MeditationSession } from 'src/types/storage.types';

const MeditationStats = ({ sessions }: { sessions: MeditationSession[] }) => {
  return (
    <View className="mt-6">
      <CustomText className="text-lg font-bold">Statistiques du mois</CustomText>
      <CustomText className="text-sm mt-2">Total de méditations : {sessions.length}</CustomText>
    </View>
  );
};

export default MeditationStats;
