"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during the server render and the first client render, true afterwards.
 *
 * Use it to gate anything the server cannot know — the clock, the resolved
 * theme, `window` — so the two renders agree and React does not warn about a
 * hydration mismatch. useSyncExternalStore rather than a mount effect: it needs
 * no setState, so it costs one render instead of two.
 */
export const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
