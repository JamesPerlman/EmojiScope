// inspired by and adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useCallback, useEffect, useRef } from 'react';
import { setInterval } from 'timers';

// Define some exported convenience types here

export type UserIntervalHookCallback = () => void;

export type UseIntervalPlayFunction = () => void;

export type UseIntervalPauseFunction = () => void;

export type UseIntervalHookControls = [UseIntervalPlayFunction, UseIntervalPauseFunction];

export type UseIntervalHookOptions = {
  autoStart: boolean; // automaticall start interval when hook is executed
};

// Define some private convenience types here
type TimeoutType = ReturnType<typeof setInterval>;

// Define some default convenience consts here

const defaultOptions = { autoStart: false };

/**
 * @name useInterval
 * @description - A hook that uses setInterval under the hood to run a callback on a timer
 * @param {function} callback - The callback to run
 * @param {number} delay - The millisecond delay between each invocation of callback
 * @param {UseIntervalHookOptions} options - Automatically start the interval when useInterval(...) is called
 *
 * @return {UseIntervalHookControls} - An array of [play, pause].  These are guaranteed to remain the same throughout the hook's life.
 */
export function useInterval(
  callback: UserIntervalHookCallback,
  delay: number,
  options: UseIntervalHookOptions = defaultOptions,
) {
  const callbackRef = useRef<UserIntervalHookCallback>();
  const delayRef = useRef<number>(delay);
  const intervalRef = useRef<TimeoutType>();
  const isPaused = useRef<boolean>(!options.autoStart);

  // This function is meant to be used within setInterval, and it always executes the current callbackRef
  function performCurrentCallback() {
    if (callbackRef.current !== undefined) {
      callbackRef.current();
    }
  }

  /**
   * @name - pause
   * @description - Pause execution of the callback via clearInterval
   */
  const pause = useCallback(() => {
    // if we are already paused, we don't need to do anything here.
    if (isPaused.current) {
      // early return stops execution
      return;
    }

    // if we've made it here, it means we aren't paused
    // so let's indicate that we are paused by setting isPaused = true
    isPaused.current = true;

    // pause means that we are going to remove the current interval completely.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  /**
   * @name - play
   * @description - Begins execution of the callback via setInterval
   */

  const play = useCallback(() => {
    // we only want to execute the play() function if we are paused
    if (!isPaused.current) {
      // if we are not paused, it means we are already playing, therefore we should return early to prevent any unexpected behavior
      return;
    }

    // if we made it to this point it means we are paused, and we can start playing now
    // so first, let's set isPaused = false
    isPaused.current = false;

    // if we had a previous intervalRef, we need to clear it before setting a new one.
    // theoretically this should not ever happen, but we need to make sure.
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
    }

    // now, let's use setInterval to start executing the callback
    intervalRef.current = setInterval(performCurrentCallback, delayRef.current);
  }, []);

  // cleanup function for hook destruction // unmounting
  const unmount = () => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
    }
  };

  // keep callbackRef up-to-date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // keep delayRef up-to-date
  useEffect(() => {
    delayRef.current = delay;

    // since delay has changed, we need to clear the current interval and set a new one
    // but only also if we are not paused
    if (isPaused.current === false && intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(performCurrentCallback, delayRef.current);
    }
  }, [delay]);

  // one-time-only effect (for handling autoStart case)
  useEffect(() => {
    // if we don't want to autoStart, then we return early and do nothing here
    if (!options.autoStart) {
      return;
    }

    if (options.autoStart) {
      intervalRef.current = setInterval(performCurrentCallback, delayRef.current);
    }

    // cleanup function
    return unmount;
  }, []);

  return [play, pause];
}
