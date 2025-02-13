import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Activity Screen yay!</Text>
    </View>
  )
}

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
})

export default ActivityScreen
