import Settings from 'src/domains/settings/components/Settings';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import HorizontalLine from 'src/domains/shared/components/HorizontalLine';

const SettingsScreen = () => {
  const { userSettings, updateUserSettings, deleteAllSessions } = useAppData();

  return (
    <ScreenLayout title="Paramètres">
      <HorizontalLine />
      <div className="min-h-0 flex-1 overflow-y-auto pt-4">
        <Settings
          userSettings={userSettings}
          updateUserSettings={updateUserSettings}
          deleteAllSessions={deleteAllSessions}
        />
      </div>
      <HorizontalLine />
    </ScreenLayout>
  );
};

export default SettingsScreen;
