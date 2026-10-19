import { useState, useCallback } from 'react';

/**
 * Hook that abstracts the Web Vibration API.
 *
 * It checks for the existence of `navigator.vibrate` and provides helper
 * functions to trigger predefined vibration patterns used throughout the app.
 */
export const useVibration = () => {
  const isSupported = typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function';

  const vibrate = useCallback((pattern: number | number[]) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  /**
   * Short vibration indicating a phase change (e.g., bloom → pour).
   * Pattern: 150 ms.
   */
  const vibratePhaseChange = useCallback(() => {
    vibrate([150]);
  }, [vibrate]);

  /**
   * Longer pattern signalling the complete extraction.
   * Pattern: 200 ms, pause 100 ms, 200 ms, pause 100 ms, 300 ms.
   */
  const vibrateComplete = useCallback(() => {
    vibrate([200, 100, 200, 100, 300]);
  }, [vibrate]);

  return {
    isSupported,
    vibrate,
    vibratePhaseChange,
    vibrateComplete,
  };
};
