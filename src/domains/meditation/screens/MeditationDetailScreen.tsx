import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import CustomAlert from 'src/domains/shared/components/CustomAlert';
import ScreenName from 'src/domains/shared/constants/screenNames';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { MeditationSession } from 'src/data/storage.types';
import MeditationDetail from '../components/MeditationDetail';
import { StackParamList } from 'src/app/navigation/navigation.types';

type MeditationDetailProps = StackScreenProps<StackParamList, ScreenName.MEDITATION_DETAIL>;

const MeditationDetailScreen = ({ route }: MeditationDetailProps) => {
  const { meditationSession }: { meditationSession: MeditationSession } = route.params || {
    meditationSession: {}
  };
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const { deleteSession } = useAppData();
  const [alertVisible, setAlertVisible] = useState(false);

  const formattedDate = format(new Date(meditationSession.date), 'dd/MM/yyyy');
  return (
    <ScreenLayout
      title={formattedDate}
      topRightComponent={
        <TouchableOpacity onPress={() => setAlertVisible(true)}>
          <Trash2 size={24} color={'black'} />
        </TouchableOpacity>
      }
    >
      <MeditationDetail meditationSession={meditationSession} />
      <CustomAlert
        visible={alertVisible}
        title="Suppression"
        message={`Êtes-vous sûr de vouloir supprimer cette méditation du ${formattedDate} ? Cette action est irréversible.`}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          deleteSession(meditationSession.id);
          navigation.goBack();
          setAlertVisible(false);
        }}
        confirmText="Supprimer"
      />
    </ScreenLayout>
  );
};

export default MeditationDetailScreen;
