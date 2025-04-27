import { View } from 'react-native';
import CustomText from 'src/domains/shared/components/CustomText';
import { MeditationQuote } from 'src/data/storage.types';
import { useEffect, useState } from 'react';

const getDailyQuote = (quotes: MeditationQuote[]) => {
  const dayIndex = new Date().getDate() % quotes.length;
  return quotes[dayIndex];
};

const DailyQuote = ({ quotes }: { quotes: MeditationQuote[] }) => {
  const [quote, setQuote] = useState<MeditationQuote | null>(null);

  useEffect(() => {
    setQuote(getDailyQuote(quotes));
  }, [quotes]);

  return (
    quote && (
      <View className="my-4">
        <CustomText className="text-center text-lg italic">"{quote.text}"</CustomText>
        <View className="flex flex-col justify-center items-center mt-6">
          {quote.author && (
            <CustomText className="text-sm italic text-gray-600">{quote.author}</CustomText>
          )}
          {quote.book && (
            <CustomText className="text-sm italic text-gray-400">{quote.book}</CustomText>
          )}
        </View>
      </View>
    )
  );
};

export default DailyQuote;
