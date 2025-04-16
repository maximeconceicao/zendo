import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from 'src/domains/shared/components/CustomText';
import { PALETTE } from 'src/theme/palette';

const ScreenLayout = ({
  title,
  subtitle,
  children,
  topRightComponent
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  topRightComponent?: React.ReactNode; // Composant en haut à droite de l'écran
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-10">
        <View className="flex-row justify-between items-start">
          <View>
            <CustomText className="text-4xl">{title}</CustomText>
            {subtitle && <CustomText className="text-lg">{subtitle}</CustomText>}
          </View>
          {topRightComponent && <View className="ml-2 mt-1">{topRightComponent}</View>}
        </View>
        <View className="mt-4 flex-1">{children}</View>
      </View>
    </SafeAreaView>
  );
};

export default ScreenLayout;
