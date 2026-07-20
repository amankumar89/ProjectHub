import { useCallback, useRef, useEffect } from "react";

const useDebounce = <T extends (...args: never[]) => never>(
  fn: T,
  delay: number = 800,
) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fn, delay]);

  const debounceFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );

  return debounceFn;
};

export default useDebounce;
