import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CustomText from './CustomText';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: { label: string; action: () => void; style: string }[];
}

export const ConfirmationModal = ({ visible, onClose, title, options }: ConfirmationModalProps) => (
  <Modal transparent={true} visible={visible} animationType="fade">
    <TouchableWithoutFeedback onPress={onClose}>
      <View
        className="flex-1 justify-center items-center bg-black/50"
        style={{ position: 'absolute', top: -150, left: 0, right: 0, bottom: 0 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="bg-white p-6 rounded-lg shadow-md h-56 w-80" style={{ zIndex: 10 }}>
            <CustomText className="text-xl text-center font-bold mb-4">{title}</CustomText>
            <View className="flex-1 justify-center">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={option.action}
                  className={index !== options.length - 1 ? 'mb-4' : ''}
                >
                  <CustomText className={option.style}>{option.label}</CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);
