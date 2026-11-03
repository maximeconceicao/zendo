import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Text } from 'src/domains/shared/components/ui/Text';
import CustomAlert from 'src/domains/shared/components/CustomAlert';
import { MeditationSession } from 'src/data/storage.types';
import { capitalizeFirstLetter } from 'src/domains/shared/utils/common.utils';
import { useAppData } from 'src/store/useAppData';

const MeditationList = ({ sessions }: { sessions: MeditationSession[] }) => {
  const { deleteSession } = useAppData();
  const [sessionToDelete, setSessionToDelete] = useState<MeditationSession | null>(null);
  const sessionCount = sessions.length;

  if (sessionCount === 0) {
    return <Text className="mt-5 text-base text-gray-500">Aucune méditation enregistrée.</Text>;
  }

  return (
    <div className="flex flex-col">
      <Text className="my-5 text-base text-gray-500">Méditations ({sessionCount})</Text>
      {sessions.map((item) => (
        <div key={item.id} className="mb-3 flex flex-row items-center justify-between">
          <div className="flex flex-col items-start">
            <Text weight="semibold" className="text-left text-lg">
              {capitalizeFirstLetter(
                format(new Date(item.date), "EEEE dd/MM à HH':'mm", { locale: fr })
              )}
            </Text>
            <Text className="mt-2 text-left text-sm">
              {item.actualDurationSeconds < 60
                ? `${item.actualDurationSeconds} secondes`
                : `${Math.floor(item.actualDurationSeconds / 60)} minutes`}
            </Text>
          </div>
          <button
            type="button"
            onClick={() => setSessionToDelete(item)}
            aria-label="Supprimer cette méditation"
            className="flex h-10 w-10 items-center justify-center rounded-full"
          >
            <Trash2 size={20} className="text-gray-400" />
          </button>
        </div>
      ))}

      <CustomAlert
        visible={sessionToDelete !== null}
        title="Suppression"
        message={
          sessionToDelete ? (
            <>
              Êtes-vous sûr de vouloir supprimer la méditation du{' '}
              <Text weight="semibold">
                {format(new Date(sessionToDelete.date), "dd/MM/yyyy à HH':'mm", { locale: fr })}
              </Text>{' '}
              ? Cette action est irréversible.
            </>
          ) : (
            ''
          )
        }
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) deleteSession(sessionToDelete.id);
          setSessionToDelete(null);
        }}
        confirmText="Supprimer"
      />
    </div>
  );
};

export default MeditationList;
