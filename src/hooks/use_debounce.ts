"use client";

// Next
import { useEffect, useState } from "react";

// Keeps typing in a search box from firing a request per keystroke.
export const useDebounce = <T,>(value: T, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
