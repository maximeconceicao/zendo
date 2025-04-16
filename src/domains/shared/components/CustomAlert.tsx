import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import CustomText from './CustomText';

type CustomAlertProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
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
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-platinium p-5 rounded-lg w-80">
              <CustomText className="text-black text-lg font-bold mb-2">{title}</CustomText>
              <CustomText className="text-black text-base mb-4">{message}</CustomText>
              <View className="flex-row justify-between">
                <TouchableOpacity onPress={onClose} className="p-2">
                  <CustomText className="text-black text-base">{cancelText}</CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} className="px-4 py-2">
                  <CustomText className={`${confirmButtonColor} text-base`}>
                    {confirmText}
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomAlert;
