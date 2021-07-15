import React, { useCallback, useEffect, useRef, useState } from 'react';
import { add2D, Point2D, subtract2D } from '../libs';

// Adapted from https://valtism.com/src/use-drag-scroll.html

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
  ) {
    return (event: MouseEvent) => {
      console.log(`MOUSE IS DOWN! position=(${event.clientX}, ${event.clientY})`);
      // prevent default behavior of this event
      event.preventDefault();

      // set isDragging = true (start dragging)
      isDragging.current = true;

      // update mousePoint at start of drag
      mousePoint.current = { x: event.clientX, y: event.clientY };
    };
  }

  function createHandleMouseMove(
    displacementRef: React.MutableRefObject<Point2D>,
    isDragging: React.MutableRefObject<boolean>,
    mousePoint: React.MutableRefObject<Point2D>,
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

      // However if we are dragging, we need to update the XY position of the mouse
      const curMousePoint: Point2D = { x: event.clientX, y: event.clientY };
      mousePoint.current = curMousePoint;

      // Calculate displacement difference
      const displacementDifference: Point2D = subtract2D(curMousePoint, prevMousePoint);

      // Add displacementDifference to displacementRef.current to get new displacement
      const currentDisplacement: Point2D = add2D(displacementRef.current, displacementDifference);

      // We need to update the displacement of the mouse
      displacementRef.current = currentDisplacement;
      setDisplacementState(displacementRef.current);
    };
  }

  function createHandleMouseUp(isDragging: React.MutableRefObject<boolean>) {
    return (event: MouseEvent) => {
      console.log(`MOUSE IS UP! position=(${event.clientX}, ${event.clientY})`);
      // prevent event default
      event.preventDefault();

      // set isDragging = false (stopDragging)
      isDragging.current = false;
    };
  }

  // return the actual hook function
  return (): Point2D => {
    // setup some ref vars
    const isDragging = useRef<boolean>(false);
    const mousePoint = useRef<Point2D>(zero2D);
    const displacementRef = useRef<Point2D>(zero2D);

    // setup some state vars
    const [displacementState, setDisplacementState] = useState<Point2D>(zero2D);

    useEffect(() => {
      // Create handleMouse optimized functions using our parent-scope function creators
      const handleMouseDown = createHandleMouseDown(isDragging, mousePoint);
      const handleMouseMove = createHandleMouseMove(
        displacementRef,
        isDragging,
        mousePoint,
        setDisplacementState,
      );
      const handleMouseUp = createHandleMouseUp(isDragging);

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

    console.log(JSON.stringify(displacementState));

    return displacementState;
  };
})();
