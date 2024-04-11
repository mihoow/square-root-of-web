import { useRef } from "react";

export function usePrevious<T>(
    value: T,
    isEqual: ((value: T, current: T) => boolean) = (value, current) => value === current
): T | null {
    const ref = useRef<{ value: T; prev: T | null }>({
      value: value,
      prev: null,
    });

    const current = ref.current.value;

    if (!isEqual(value, current)) {
      ref.current = {
        value: value,
        prev: current,
      };
    }

    return ref.current.prev;
}
