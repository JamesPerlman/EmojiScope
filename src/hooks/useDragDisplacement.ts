// Inspired by https://valtism.com/src/use-drag-scroll.html

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimationConstants } from '../constants';
import { add2D, Point2D, subtract2D, Velocity2D } from '../libs';
import { useInterval } from './useInterval';
import { useOnChange } from './useOnChange';

export type DragDisplacementHookOptions = {
  useMomentum: boolean;
  damping: number; // between 0 and 1
};

/**
 * @description This is a hook for determining when a user drags the mouse
 * @return displacement of mouse drag
 */
export const useDragDisplacement = (function () {
  const zero2D: Point2D = { x: 0, y: 0 };

  /*
    Optimization technique: defining function factories outside of the actual hook allows us to create the function we need once (within the useEffect that runs only once)
    Instead of defining these functions inside the body of the hook, in which case they would be defined every time the hook runs (aka at least every time the mouse moves)
    ...which seems like a completely unnecessary waste of performance
  */
  function createHandleMouseDown(
    isDragging: React.MutableRefObject<boolean>,
    mousePoint: React.MutableRefObject<Point2D>,
    prevEventTime: React.MutableRefObject<number>,
    setIsDecelerating: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    return (event: MouseEvent) => {
      // prevent default behavior of this event
      event.preventDefault();

      // stop deceleration animation
      setIsDecelerating(false);

      // set isDragging = true (start dragging)
      isDragging.current = true;

      // update mousePoint at start of drag
      mousePoint.current = { x: event.clientX, y: event.clientY };

      // update prevEventTime
      prevEventTime.current = Date.now();
    };
  }

  function createHandleMouseMove(
    displacementRef: React.MutableRefObject<Point2D>,
    isDragging: React.MutableRefObject<boolean>,
    mousePoint: React.MutableRefObject<Point2D>,
    prevEventTime: React.MutableRefObject<number>,
    mouseSpeed: React.MutableRefObject<Velocity2D>,
    setDisplacementState: React.Dispatch<React.SetStateAction<Point2D>>,
  ) {
    return (event: MouseEvent) => {
      // If we're not currently dragging, we don't want to execute any code here.
      if (!isDragging.current) {
        return;
      }
      // prevent event default
      event.preventDefault();

      // Save previous position
      const prevMousePoint = mousePoint.current;

      // Get a reference to the current mouse x and y
      const curMousePoint: Point2D = { x: event.clientX, y: event.clientY };

      // Now we can get the difference between the current and previous mouse positions
      const { x: dx, y: dy } = subtract2D(curMousePoint, prevMousePoint);

      // We also need to get the difference in time since the last mouse event (in milliseconds)
      const dt = 0.001 * (Date.now() - prevEventTime.current);

      // Now we can calculate the speed of the last mouse move
      mouseSpeed.current = {
        x: dx / dt,
        y: dy / dt,
      };

      // Update current mousePoint based on this event
      mousePoint.current = curMousePoint;

      // Calculate displacement difference
      const displacementDifference: Point2D = subtract2D(curMousePoint, prevMousePoint);

      // Add displacementDifference to displacementRef.current to get new displacement
      const currentDisplacement: Point2D = add2D(displacementRef.current, displacementDifference);

      // Update displacement (using ref value)
      displacementRef.current = currentDisplacement;

      // Update displacement (using state setter)
      setDisplacementState(displacementRef.current);

      // Update prevEventTime
      prevEventTime.current = Date.now();
    };
  }

  function createHandleMouseUp(
    isDragging: React.MutableRefObject<boolean>,
    mousePoint: React.MutableRefObject<Point2D>,
    prevEventTime: React.MutableRefObject<number>,
    setIsDecelerating: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    return (event: MouseEvent) => {
      // prevent event default
      event.preventDefault();

      // set isDragging = false (stopDragging)
      isDragging.current = false;

      /*
        The theory:

        When mouse goes up, we need to know what the dragging velocity is.
        Once we have the dragging velocity, we can start a process that decreases the velocity over time
        This will simulate deceleration, aka the "drag momentum effect"
      */

      // let's get the cursor velocity
      const curMousePoint: Point2D = {
        x: event.clientX,
        y: event.clientY,
      };

      // Now we trigger the deceleration animation by setting isDecelerating = true
      setIsDecelerating(true);

      // Update current mousePoint based on this event
      mousePoint.current = curMousePoint;

      // Update prevEventTime
      prevEventTime.current = Date.now();
    };
  }

  /*
    RETURN THE ACTUAL HOOK FUNCTION HERE!
  */
  return (options: DragDisplacementHookOptions): Point2D => {
    // setup some ref vars
    const isDragging = useRef<boolean>(false);
    const mousePoint = useRef<Point2D>(zero2D);
    const displacementRef = useRef<Point2D>(zero2D);
    const prevEventTime = useRef<number>(Date.now());
    const mouseSpeed = useRef<Velocity2D>(zero2D);

    // setup some state vars
    const [displacementState, setDisplacementState] = useState<Point2D>(zero2D);
    const [isDecelerating, setIsDecelerating] = useState<boolean>(false);

    // Main useEffect for this hook, sets up all the mouse event listeners
    useEffect(() => {
      // Create handleMouse optimized functions using our parent-scope function creators
      const handleMouseDown = createHandleMouseDown(
        isDragging,
        mousePoint,
        prevEventTime,
        setIsDecelerating,
      );

      const handleMouseMove = createHandleMouseMove(
        displacementRef,
        isDragging,
        mousePoint,
        prevEventTime,
        mouseSpeed,
        setDisplacementState,
      );

      const handleMouseUp = createHandleMouseUp(
        isDragging,
        mousePoint,
        prevEventTime,
        setIsDecelerating,
      );

      // Add listeners for mouse events
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // return a function that gets called when the component using this hook gets unmounted
      return () => {
        // When component unmounts, we want to remove the mouse event listeners we added earlier.
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseUp);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);

    /* MOMENTUM EFFECTS */

    const lastDecelFrameTime = useRef<number>(0);

    const decelDragCallback = useCallback(() => {
      // we need to get dt, aka the time that has elapsed since startDecelAnimation() was called
      // dt is in seconds
      const dt = 0.001 * (Date.now() - lastDecelFrameTime.current);

      // Now we just do some physics
      // velocity += accel * dt

      const { x: vx, y: vy } = mouseSpeed.current;

      // Just use damping to decrease velocity
      const newVelocity: Velocity2D = {
        x: vx * options.damping,
        y: vy * options.damping,
      };

      // position += velocity * dt
      const { x: px, y: py } = displacementRef.current;
      const newDisplacement: Point2D = {
        x: px + newVelocity.x * dt,
        y: py + newVelocity.y * dt,
      };

      mouseSpeed.current = newVelocity;
      displacementRef.current = newDisplacement;

      setDisplacementState(newDisplacement);

      // at some point if velocity is close enough to zero, we have to pauseDecelAnimation
      const newVelocityMagnitude = Math.sqrt(
        Math.pow(newVelocity.x, 2) + Math.pow(newVelocity.y, 2),
      );
      if (newVelocityMagnitude < 1) {
        pauseDecelAnimation();
        console.log('stop decelerating');
      }
      lastDecelFrameTime.current = Date.now();
      console.log('decelerating');
    }, [options.damping]);

    const [startDecelAnimation, pauseDecelAnimation] = useInterval(
      decelDragCallback,
      AnimationConstants.millisecondsFor30fps,
    );

    // this is where the magical momentum effects happen
    // when isDecelerating changes from false to true, we begin animating and decelerating
    useOnChange(
      isDecelerating,
      false,
      true,
      () => {
        lastDecelFrameTime.current = Date.now();
        startDecelAnimation();
      },
      [],
    );

    // when isDecelerating changes from true to false, we stop animating and decelerating

    useOnChange(
      isDecelerating,
      true,
      false,
      () => {
        pauseDecelAnimation();
      },
      [],
    );

    return {
      x: displacementState.x,
      y: displacementState.y,
    };
  };
})();
