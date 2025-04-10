import React from 'react';
import HorizontalLine from 'src/components/HorizontalLine';
import QuoteManager from 'src/components/QuoteManager';
import ScreenLayout from 'src/layouts/ScreenLayout';

const QuoteManagerScreen = () => {
  return (
    <ScreenLayout title="Citations">
      <HorizontalLine />
      <QuoteManager />
    </ScreenLayout>
  );
};

export default QuoteManagerScreen;
