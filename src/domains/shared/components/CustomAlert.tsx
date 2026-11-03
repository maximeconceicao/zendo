import { ReactNode } from 'react';
import { Modal } from 'src/domains/shared/components/ui/Modal';
import { Text } from 'src/domains/shared/components/ui/Text';

type CustomAlertProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmButtonColor?: string;
};

const CustomAlert = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = 'Annuler',
  confirmText = 'Confirmer',
  confirmButtonColor = 'text-red-400'
}: CustomAlertProps) => {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <div className="flex flex-1 items-center justify-center bg-black/50" onClick={onClose}>
        <div
          className="flex flex-col bg-platinium p-5 rounded-lg w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <Text weight="semibold" className="text-black text-lg mb-2">
            {title}
          </Text>
          <Text className="text-black text-base mb-4">{message}</Text>
          <div className="flex flex-row justify-between">
            <button type="button" onClick={onClose} className="p-2">
              <Text className="text-black text-base">{cancelText}</Text>
            </button>
            <button type="button" onClick={onConfirm} className="px-4 py-2">
              <Text className={`${confirmButtonColor} text-base`}>{confirmText}</Text>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomAlert;
