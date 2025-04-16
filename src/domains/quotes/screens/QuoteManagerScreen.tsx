import React from 'react';
import HorizontalLine from 'src/domains/shared/components/HorizontalLine';
import QuoteManager from 'src/domains/quotes/components/QuoteManager';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';

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
