import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from 'src/components/CustomText';
import { PALETTE } from 'src/theme/palette';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-10 bg-platinium">
        <CustomText className="text-4xl">Home</CustomText>

        <TouchableOpacity
          className="absolute bottom-10 left-10 right-10 bg-black p-4 rounded-lg"
          onPress={() => navigation.navigate('Session')}
        >
          <CustomText className="text-white text-center text-lg">Démarrer la méditation</CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
