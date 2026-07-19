"use client";

import { useEffect, useState } from "react";

/**
 * Delay a rapidly changing value. Used to keep typing in a search box from
 * firing a request per keystroke.
 */
export function useDebounce<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
