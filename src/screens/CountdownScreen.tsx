import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CountdownScreen = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startCountdown = () => setIsRunning(true);
  const pauseCountdown = () => setIsRunning(false);

  const resetCountdown = () => {
    setIsRunning(false);
    setTimeLeft(60); // Reset to initial value
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeLeft}s</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={startCountdown} disabled={isRunning} />
        <Button title="Pause" onPress={pauseCountdown} disabled={!isRunning} />
        <Button title="Reset" onPress={resetCountdown} />
      </View>
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
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10, // Requires React Native >= 0.71
    justifyContent: 'space-between'
  }
});

export default CountdownScreen;
