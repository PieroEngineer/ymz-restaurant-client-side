import { useEffect, useReducer } from "react";

// Stopwatch.tsx
export function Stopwatch({ onQueuedTimestamp }: { onQueuedTimestamp: number }) {
  const [, forceTick] = useReducer(x => x + 1, 0);

  useEffect(() => {
  let intervalId: ReturnType<typeof setInterval>;

  const msUntilNextMinute = 60000 - (Date.now() % 60000);
  const timeoutId = setTimeout(() => {
    forceTick();
    intervalId = setInterval(forceTick, 60000); // starts exactly on the minute boundary
  }, msUntilNextMinute);

  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}, []);

  const elapsedMinutes = Math.floor((Date.now() - onQueuedTimestamp) / 60000);
  return <span>{elapsedMinutes} min ago</span>;
}