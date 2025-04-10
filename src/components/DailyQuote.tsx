import { View } from 'react-native';
import CustomText from './CustomText';
import { MeditationQuote } from 'src/types/storage.types';
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
        <CustomText className="text-center text-sm mt-2">- {quote.author}</CustomText>
      </View>
    )
  );
};

export default DailyQuote;
