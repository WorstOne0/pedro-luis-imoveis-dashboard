"use client";

// Next
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False on the server and the first client render, true after: gates the clock, the theme, window.
export const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
