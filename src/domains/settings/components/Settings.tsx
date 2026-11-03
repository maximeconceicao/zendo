import { useState } from 'react';
import Switch from 'src/domains/shared/components/ui/Switch';
import { Text } from 'src/domains/shared/components/ui/Text';
import { exportMeditationSessions } from 'src/data/storage';
import { UserSettings } from 'src/data/storage.types';
import SoundSelectModal from 'src/domains/settings/components/SoundSelectModal';
import { soundLabels } from 'src/domains/shared/constants/common.constants';
import CustomAlert from 'src/domains/shared/components/CustomAlert';
import { useSoundSelectModal } from '../hooks/useSoundSelectModal';

const Settings = ({
  userSettings,
  updateUserSettings,
  deleteAllSessions
}: {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  deleteAllSessions: () => void;
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const { isVisible, soundOptions, value, onSelect, onClose, open } = useSoundSelectModal({
    userSettings,
    updateUserSettings
  });

  return (
    <div className="flex flex-col">
      {/* SESSION */}
      <div className="mb-6 flex flex-col">
        <div className="flex flex-col">
          <Text weight="semibold" className="text-lg text-gray-900">
            Session
          </Text>
          <Text className="text-gray-600">Personnalisez votre expérience</Text>
        </div>

        <div className="flex flex-row items-center justify-between border-b border-gray-300 py-3">
          <button
            type="button"
            className="flex flex-1 flex-col items-start text-left"
            onClick={() => {
              if (userSettings.soundOnSessionStart) open('start');
            }}
          >
            <Text className="text-lg text-gray-900">Son de début</Text>
            <Text className="text-lg text-gray-400">
              {userSettings.soundOnSessionStart
                ? soundLabels[userSettings.soundTypeOnSessionStart]
                : 'Désactivé'}
            </Text>
          </button>
          <Switch
            aria-label="Son de début"
            checked={Boolean(userSettings.soundOnSessionStart)}
            onChange={() =>
              updateUserSettings({ soundOnSessionStart: !userSettings.soundOnSessionStart })
            }
          />
        </div>

        <div className="flex flex-row items-center justify-between border-b border-gray-300 py-3">
          <button
            type="button"
            className="flex flex-1 flex-col items-start text-left"
            onClick={() => {
              if (userSettings.soundOnSessionEnd) open('end');
            }}
          >
            <Text className="text-lg text-gray-900">Son de fin</Text>
            <Text className="text-lg text-gray-400">
              {userSettings.soundOnSessionEnd
                ? soundLabels[userSettings.soundTypeOnSessionEnd]
                : 'Désactivé'}
            </Text>
          </button>
          <Switch
            aria-label="Son de fin"
            checked={Boolean(userSettings.soundOnSessionEnd)}
            onChange={() =>
              updateUserSettings({ soundOnSessionEnd: !userSettings.soundOnSessionEnd })
            }
          />
        </div>

        <div className="flex flex-row items-center justify-between border-b border-gray-300 py-3">
          <Text className="text-lg text-gray-900">Vibration de début</Text>
          <Switch
            aria-label="Vibration de début"
            checked={Boolean(userSettings?.vibrateOnSessionStart)}
            onChange={() =>
              updateUserSettings({ vibrateOnSessionStart: !userSettings?.vibrateOnSessionStart })
            }
          />
        </div>

        <div className="flex flex-row items-center justify-between border-b border-gray-300 py-3">
          <Text className="text-lg text-gray-900">Vibration de fin</Text>
          <Switch
            aria-label="Vibration de fin"
            checked={Boolean(userSettings?.vibrateOnSessionEnd)}
            onChange={() =>
              updateUserSettings({ vibrateOnSessionEnd: !userSettings?.vibrateOnSessionEnd })
            }
          />
        </div>
      </div>

      {/* DATA */}
      <div className="mb-6 flex flex-col">
        <div className="flex flex-col">
          <Text weight="semibold" className="text-lg text-gray-900">
            Données
          </Text>
          <Text className="text-gray-600">Gestion des données</Text>
        </div>
        <button
          type="button"
          className="flex flex-row items-center justify-between border-b border-gray-300 py-3 text-left"
          onClick={() => exportMeditationSessions()}
        >
          <Text className="text-lg text-gray-900">Exporter les données</Text>
        </button>
        <button
          type="button"
          className="flex flex-row items-center justify-between border-b border-gray-300 py-3 text-left"
          onClick={() => setAlertVisible(true)}
        >
          <Text className="text-lg text-red-400">Supprimer les données</Text>
        </button>
      </div>

      <CustomAlert
        visible={alertVisible}
        title="Confirmation"
        message="Êtes-vous sûr de vouloir supprimer toutes les séances de méditation ? Cette action est irréversible."
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          deleteAllSessions();
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
    </div>
  );
};

export default Settings;
