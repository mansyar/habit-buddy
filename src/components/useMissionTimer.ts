import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useMissionTimer = (defaultDurationMinutes: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(defaultDurationMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsActive(true);
    }
  }, [timeLeft]);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(defaultDurationMinutes * 60);
  }, [defaultDurationMinutes]);

  const adjustTime = useCallback((seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds));
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        setIsActive(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  return {
    timeLeft,
    isActive,
    start,
    stop,
    reset,
    adjustTime,
  };
};
