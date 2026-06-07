import { useCallback, useState } from 'react';

// TODO: It work nicem but there are somethings to improve:
// - Some undos and redos are ghost (do nothing)
// - In Dish chart, the undo in letters shouldn't be by letters, but by textfield modified 

interface UndoableStateOptions<T> {
  isEqual: (left: T, right: T) => boolean;
}

interface CommitOptions<T> {
  record?: boolean;
  historyBase?: T;
}

interface UndoableState<T> {
  value: T;
  setValue: (updater: T | ((current: T) => T), options?: CommitOptions<T>) => void;
  reset: (nextValue: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useUndoableState<T>(
  initialValue: T,
  { isEqual }: UndoableStateOptions<T>
): UndoableState<T> {
  const [present, setPresent] = useState<T>(initialValue);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const setValue = useCallback(
    (updater: T | ((current: T) => T), options: CommitOptions<T> = {}) => {
      const shouldRecord = options.record ?? true;

      setPresent((current) => {
        const next =
          typeof updater === 'function'
            ? (updater as (currentValue: T) => T)(current)
            : updater;

        if (shouldRecord) {
          const historyBase = options.historyBase ?? current;

          if (!isEqual(historyBase, next)) {
            setPast((previousPast) => [...previousPast, historyBase]);
            setFuture([]);
          }
        }

        if (isEqual(current, next)) return current;

        return next;
      });
    },
    [isEqual]
  );

  const reset = useCallback((nextValue: T) => {
    setPresent(nextValue);
    setPast([]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast((currentPast) => {
      if (currentPast.length === 0) return currentPast;

      const previousValue = currentPast[currentPast.length - 1];
      setPresent((currentPresent) => {
        setFuture((currentFuture) => [currentPresent, ...currentFuture]);
        return previousValue;
      });

      return currentPast.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((currentFuture) => {
      if (currentFuture.length === 0) return currentFuture;

      const nextValue = currentFuture[0];
      setPresent((currentPresent) => {
        setPast((currentPast) => [...currentPast, currentPresent]);
        return nextValue;
      });

      return currentFuture.slice(1);
    });
  }, []);

  return {
    value: present,
    setValue,
    reset,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
