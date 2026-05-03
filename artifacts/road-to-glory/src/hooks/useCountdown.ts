import { useState, useEffect } from 'react';

const KICKOFF = new Date('2026-06-11T20:00:00Z'); // Opening match, MetLife Stadium

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function useCountdown(): TimeLeft {
  const calc = (): TimeLeft => {
    const total = Math.max(0, KICKOFF.getTime() - Date.now());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    const days = Math.floor(total / 1000 / 60 / 60 / 24);
    return { days, hours, minutes, seconds, total };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calc);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}
