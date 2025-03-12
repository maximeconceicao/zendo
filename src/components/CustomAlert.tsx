import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
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
  confirmButtonColor = 'white'
}: CustomAlertProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-black p-5 rounded-lg w-80">
          <CustomText className="text-white text-lg font-bold mb-2">{title}</CustomText>
          <CustomText className="text-white text-base mb-4">{message}</CustomText>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="p-2">
              <CustomText className="text-white text-base">{cancelText}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="px-4 py-2">
              <CustomText className="text-red-400 text-base">{confirmText}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
