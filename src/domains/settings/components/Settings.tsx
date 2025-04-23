import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { StackParamList } from 'src/app/navigation/AppNavigator';
import { deleteMeditationSessions, exportMeditationSessions } from 'src/data/storage';
import { UserSettings } from 'src/data/storage.types';
import SoundSelectModal from 'src/domains/settings/components/SoundSelectModal';
import CustomText from 'src/domains/shared/components/CustomText';
import { soundLabels } from 'src/domains/shared/constants/common.constants';
import ScreenName from 'src/domains/shared/constants/screenNames';
import CustomAlert from '../../shared/components/CustomAlert';
import { useSoundSelectModal } from '../hooks/useSoundSelectModal';

const Settings = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  const [alertVisible, setAlertVisible] = useState(false);

  const { isVisible, soundOptions, value, onSelect, onClose, open } = useSoundSelectModal({
    userSettings,
    updateUserSettings
  });

  return (
    <View>
      {/*
       * SESSION
       */}

      <View className="mb-6">
        <View>
          <CustomText className="text-lg text-gray-900" bold>
            Session
          </CustomText>
          <CustomText className="text-gray-600">Personnalisez votre expérience</CustomText>
        </View>
        <Pressable
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={() => {
            if (userSettings.soundOnSessionStart) {
              open('start');
            }
          }}
        >
          <View className="flex-col">
            <CustomText className={`text-lg text-gray-900`}>Son de début</CustomText>

            <CustomText className={`text-lg text-gray-400`}>
              {userSettings.soundOnSessionStart
                ? soundLabels[userSettings.soundTypeOnSessionStart]
                : 'Désactivé'}
            </CustomText>
          </View>

          <Switch
            value={Boolean(userSettings.soundOnSessionStart)}
            onValueChange={() =>
              updateUserSettings({
                soundOnSessionStart: !Boolean(userSettings.soundOnSessionStart)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>

        <Pressable
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={() => {
            if (userSettings.soundOnSessionEnd) {
              open('end');
            }
          }}
        >
          <View className="flex-col">
            <CustomText className={`text-lg text-gray-900`}>Son de fin</CustomText>
            <CustomText className={`text-lg text-gray-400`}>
              {userSettings.soundOnSessionEnd
                ? soundLabels[userSettings.soundTypeOnSessionEnd]
                : 'Désactivé'}
            </CustomText>
          </View>

          <Switch
            value={Boolean(userSettings.soundOnSessionEnd)}
            onValueChange={() =>
              updateUserSettings({
                soundOnSessionEnd: !Boolean(userSettings.soundOnSessionEnd)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>
        <Pressable className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <CustomText className={`text-lg text-gray-900`}>Vibration de début</CustomText>

          <Switch
            value={Boolean(userSettings?.vibrateOnSessionStart)}
            onValueChange={() =>
              updateUserSettings({
                vibrateOnSessionStart: !Boolean(userSettings?.vibrateOnSessionStart)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>
        <Pressable className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <CustomText className={`text-lg text-gray-900`}>Vibration de fin</CustomText>

          <Switch
            value={Boolean(userSettings?.vibrateOnSessionEnd)}
            onValueChange={() =>
              updateUserSettings({
                vibrateOnSessionEnd: !Boolean(userSettings?.vibrateOnSessionEnd)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>
        <Pressable className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <CustomText className={`text-lg text-gray-900`}>Vibration au recentrage</CustomText>

          <Switch
            value={Boolean(userSettings?.vibrateOnFocus)}
            onValueChange={() =>
              updateUserSettings({
                vibrateOnFocus: !Boolean(userSettings?.vibrateOnFocus)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>
      </View>

      {/*
       * QUOTES
       */}

      <View className="mb-6">
        <View>
          <CustomText className="text-lg text-gray-900" bold>
            Citations
          </CustomText>
          <CustomText className="text-gray-600">Afficher et gérer vos citations</CustomText>
        </View>
        <Pressable className="flex-row justify-between items-center py-3 border-b border-gray-300">
          <CustomText className={`text-lg text-gray-900`}>Afficher les citations</CustomText>

          <Switch
            value={Boolean(userSettings?.showQuotes)}
            onValueChange={() =>
              updateUserSettings({
                showQuotes: !Boolean(userSettings?.showQuotes)
              })
            }
            trackColor={{ false: '#A0A0A0', true: '#505050' }}
            thumbColor={'#000000'}
          />
        </Pressable>
        <Pressable
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={() => navigation.navigate(ScreenName.QUOTE_MANAGER)}
        >
          <CustomText className={`text-lg text-gray-900`}>Gérer les citations</CustomText>

          <ChevronRight size={20} color="black" />
        </Pressable>
      </View>

      {/*
       * DATA
       */}

      <View className="mb-6">
        <View>
          <CustomText className="text-lg text-gray-900" bold>
            Données
          </CustomText>
          <CustomText className="text-gray-600">Gestion des données</CustomText>
        </View>
        <Pressable
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={exportMeditationSessions}
        >
          <CustomText className={`text-lg text-gray-900`}>Exporter les données</CustomText>
        </Pressable>
        <Pressable
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={() => setAlertVisible(true)}
        >
          <CustomText className={`text-lg text-red-400`}>Supprimer les données</CustomText>
        </Pressable>
      </View>

      <CustomAlert
        visible={alertVisible}
        title="Confirmation"
        message="Êtes-vous sûr de vouloir supprimer toutes les séances de méditation ? Cette action est irréversible."
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          deleteMeditationSessions();
          setAlertVisible(false);
        }}
      />
      <SoundSelectModal
        visible={isVisible}
        options={soundOptions}
        onClose={onClose}
        value={value}
        onSelect={onSelect}
      />
    </View>
  );
};

export default Settings;
