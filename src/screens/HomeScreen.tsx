import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from 'src/components/CustomText';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.text}>Welcome to the Home Screen!</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  text: {
    fontSize: 20,
    color: '#333'
  }
});

export default HomeScreen;
