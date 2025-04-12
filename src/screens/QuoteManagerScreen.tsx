import React from 'react';
import HorizontalLine from 'src/components/HorizontalLine';
import QuoteManager from 'src/components/QuoteManager';
import { useAppData } from 'src/hooks/useAppData';
import ScreenLayout from 'src/layouts/ScreenLayout';

const QuoteManagerScreen = () => {
  const { meditationQuotes, upsertQuote, deleteQuote } = useAppData();

  return (
    <ScreenLayout title={`Citations (${meditationQuotes?.length || 0})`}>
      <HorizontalLine />
      <QuoteManager
        meditationQuotes={meditationQuotes || []}
        upsertQuote={upsertQuote}
        deleteQuote={deleteQuote}
      />
    </ScreenLayout>
  );
};

export default QuoteManagerScreen;
