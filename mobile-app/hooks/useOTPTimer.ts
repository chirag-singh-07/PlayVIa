import { useState, useEffect } from 'react';

export const useOTPTimer = (initialSeconds: number = 30) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
  };

  return {
    seconds,
    isActive,
    resetTimer,
  };
};
