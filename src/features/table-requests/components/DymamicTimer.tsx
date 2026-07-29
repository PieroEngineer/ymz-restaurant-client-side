import { useEffect, useMemo, useReducer } from "react";

export function DymamicTimer({ checkpointTimestamp }: { checkpointTimestamp: number }) {
  const [, forceTick] = useReducer(x => x + 1, 0);

  // Mode is decided ONCE per checkpoint value, not recalculated on every tick —
  // otherwise a countdown crossing zero would flicker into "elapsed" for a render.
  const countdownMode = useMemo(() => {return checkpointTimestamp > Date.now()}, [checkpointTimestamp]);  /// Maybe the time could continue after zero, so the restaurant know when the user should have arrived

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    function tick() {
      forceTick();
      if (countdownMode && checkpointTimestamp - Date.now() <= 0 && intervalId) {
        clearInterval(intervalId); // countdown finished — stop ticking for good
      }
    }

    const msUntilNextMinute = 60000 - (Date.now() % 60000);
    const timeoutId = setTimeout(() => {
      tick();
      const stillCounting = !countdownMode || checkpointTimestamp - Date.now() > 0;
      if (stillCounting) {
        intervalId = setInterval(tick, 60000); // starts exactly on the minute boundary
      }
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkpointTimestamp, countdownMode]);

  const minutes = countdownMode
    ? Math.max(0, Math.ceil((checkpointTimestamp - Date.now()) / 60000))
    : Math.floor((Date.now() - checkpointTimestamp) / 60000);

  return <span>{countdownMode ? `${minutes} min left` : `${minutes} min ago`}</span>;
}