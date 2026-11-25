import {useEffect, useState} from 'react';

export function useLiveClock(initialDate?: Date): Date {
  const [now, setNow] = useState<Date>(() => initialDate ?? new Date());

  useEffect(() => {
    if (initialDate) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [initialDate]);

  return now;
}
