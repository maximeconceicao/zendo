import { useState, useEffect } from 'react';

const useSessionTimer = (initialTime: number = 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev - 1;
          setElapsedTime(initialTime - newTimeLeft);
          return newTimeLeft;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, initialTime]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setElapsedTime(0);
  };

  return { timeLeft, elapsedTime, isRunning, start, pause, reset };
};

export default useSessionTimer;
