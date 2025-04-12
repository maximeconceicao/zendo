import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { MeditationQuote, MeditationQuoteUpsert } from 'src/types/storage.types';
import CustomText from './CustomText';
import HorizontalLine from './HorizontalLine';
import { QuoteEditModal } from './QuoteEditModal';

const emptyQuote: Omit<MeditationQuote, 'id' | 'createdAt'> = { text: '', author: '', book: '' };

interface QuoteManagerProps {
  meditationQuotes: MeditationQuote[];
  upsertQuote: (quote: MeditationQuoteUpsert) => void;
  deleteQuote: (id: string) => void;
}

const QuoteManager = ({ meditationQuotes, upsertQuote, deleteQuote }: QuoteManagerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState<MeditationQuoteUpsert>(emptyQuote);

  return (
    <>
      <View className="flex-1">
        <View className="flex-1">
          <FlatList
            data={meditationQuotes}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setQuoteToEdit(item);
                  setModalVisible(true);
                }}
              >
                <View className="p-4 my-2 rounded-md border border-gray-300">
                  <CustomText className="text-lg">{item.text}</CustomText>
                  <View className="flex flex-row justify-end">
                    {item.author && (
                      <CustomText className="text-sm italic text-gray-600">
                        {item.author}
                      </CustomText>
                    )}
                    {item.book && (
                      <CustomText className="text-sm italic text-gray-600">
                        {' '}
                        - {item.book}
                      </CustomText>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <HorizontalLine className="mb-5" />

        <TouchableOpacity
          className={`flex items-center justify-center bg-black rounded-md p-2`}
          onPress={() => {
            setQuoteToEdit(emptyQuote);
            setModalVisible(true);
          }}
        >
          <Plus color={'white'} />
        </TouchableOpacity>
      </View>
      <QuoteEditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        quote={quoteToEdit}
        onSave={function (quote: MeditationQuoteUpsert): void {
          upsertQuote(quote);
        }}
        onDelete={function (quoteId: string): void {
          deleteQuote(quoteId);
        }}
      />
    </>
  );
};

export default QuoteManager;
