import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { PALETTE } from 'src/theme/palette';
import { MeditationQuoteUpsert } from 'src/types/storage.types';
import CustomText from './CustomText';

interface QuoteEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (quote: MeditationQuoteUpsert) => void;
  onDelete: (quoteId: string) => void;
  quote: MeditationQuoteUpsert;
}

export const QuoteEditModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  quote
}: QuoteEditModalProps) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [book, setBook] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(quote.text || '');
    setAuthor(quote.author || '');
    setBook(quote.book || '');
  }, [quote, visible]);

  const handleSave = () => {
    if (!text.trim()) {
      setError('La citation ne peut pas être vide.');
      return;
    }
    onSave({ id: quote.id, text: text.trim(), author: author.trim(), book: book.trim() });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="bg-white p-6 rounded-2xl shadow-lg w-96">
              <CustomText className="text-xl font-bold text-center mb-4">
                {quote ? 'Modifier la citation' : 'Nouvelle citation'}
              </CustomText>

              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3 text-base text-gray-800"
                placeholder="Citation"
                placeholderTextColor={PALETTE.text.secondary}
                value={text}
                onChangeText={(value) => {
                  setText(value);
                  if (error && value.trim()) setError(null);
                }}
                multiline
                textAlignVertical="top"
                numberOfLines={4}
              />

              {error && <CustomText className="text-red-500 text-sm mb-2">{error}</CustomText>}

              <TextInput
                className="border border-gray-200 rounded-lg p-3 mb-3 text-base text-gray-700"
                placeholder="Auteur"
                placeholderTextColor={PALETTE.text.secondary}
                value={author}
                onChangeText={setAuthor}
              />

              <TextInput
                className="border border-gray-200 rounded-lg p-3 mb-4 text-base text-gray-700"
                placeholder="Livre"
                placeholderTextColor={PALETTE.text.secondary}
                value={book}
                onChangeText={setBook}
              />

              <View className="flex-row justify-between items-center">
                {quote.id && (
                  <Pressable onPress={() => onDelete(quote.id!)}>
                    <CustomText className="text-red-500">Supprimer</CustomText>
                  </Pressable>
                )}
                <View className="flex-row space-x-4 ml-auto">
                  <Pressable onPress={onClose}>
                    <CustomText className="px-4 py-2 text-gray-500">Annuler</CustomText>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    disabled={!text.trim()}
                    className="px-4 py-2 rounded-lg bg-black"
                  >
                    <CustomText className="text-white font-medium">Enregistrer</CustomText>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
