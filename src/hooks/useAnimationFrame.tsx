import { useEffect, useRef, useCallback } from "react";
import type { MutableRefObject } from "react";

import { getMean } from "Utils/math";
import type { Vector } from "Utils/math";

/**
 * A custom hook to use `requestAnimationFrame` in a React component, with interactivity
 *
 * @param onFrame - A callback to be run on every frame of the animation
 * @param options - An optional configuration object for the animation
 * @returns An object containing refs to the animations `OnFrameProps`, as well as a functions to stop and start the animation
 */
export const useAnimationFrame = (
    onFrame?: (props: OnFrameProps) => void,
    options: UseAnimationFrameOptions = {}
): UseAnimationFrameResult => {
    const {
        onStart,
        onEnd,
        delay,
        endAfter,
        fps: throttledFps,
        willPlay = true,
        domElementRef,
    } = options;

    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<DOMHighResTimeStamp>(performance.now());
    const prevFrameTimeRef = useRef<DOMHighResTimeStamp>(performance.now());

    const isPlaying = useRef(false);
    const elapsedTime = useRef(0);
    const deltaTime = useRef(0);
    const frameCount = useRef(1);
    const fpsArray = useRef<number[]>(new Array(20).fill(throttledFps ?? 60));
    const averageFps = useRef(throttledFps ?? 60);

    const mousePosition = useRef<Vector<2>>([0, 0]);
    const normalisedMousePosition = useRef<Vector<2>>([0, 0]);
    const mouseHasEntered = useRef(false);
    const mouseIsIdle = useRef(true);
    const mouseIsDown = useRef(false);

    const animate = useCallback(
        (timestamp: DOMHighResTimeStamp) => {
            elapsedTime.current = Math.round(timestamp - startTimeRef.current);
            deltaTime.current = timestamp - prevFrameTimeRef.current;
            const currentFps = Math.round(1 / deltaTime.current);

            const runFrame = () => {
                onFrame?.({
                    elapsedTime: elapsedTime.current,
                    deltaTime: deltaTime.current,
                    frameCount: frameCount.current,
                    fps: averageFps.current,
                    isPlaying: isPlaying.current,
                    mouseHasEntered: mouseHasEntered.current,
                    mousePosition: mousePosition.current,
                    normalisedMousePosition: normalisedMousePosition.current,
                    mouseIsDown: mouseIsDown.current,
                    mouseIsIdle: mouseIsIdle.current,
                });

                frameCount.current += 1;
                fpsArray.current.shift();
                fpsArray.current = [...fpsArray.current, currentFps];
                averageFps.current = getMean(fpsArray.current);
                prevFrameTimeRef.current = timestamp;
            };

            if (throttledFps) {
                if (deltaTime.current >= 1000 / throttledFps) runFrame();
            } else {
                runFrame();
            }

            requestRef.current = requestAnimationFrame(animate);
        },
        [onFrame, throttledFps]
    );

    const startAnimation = useCallback(() => {
        if (!isPlaying.current) {
            requestRef.current = requestAnimationFrame(animate);
            isPlaying.current = true;
        }
    }, [animate]);

    const stopAnimation = () => {
        if (isPlaying.current) {
            cancelAnimationFrame(requestRef.current);
            isPlaying.current = false;
        }
    };

    useEffect(() => {
        if (willPlay) {
            setTimeout(() => {
                startAnimation();
                onStart?.();
            }, delay ?? 0);

            if (endAfter) {
                setTimeout(() => {
                    stopAnimation();
                    onEnd?.();
                }, endAfter);
            }
        }

        return () => stopAnimation();
    }, [animate, onStart, onEnd, delay, endAfter, willPlay, startAnimation]);

    useEffect(() => {
        const element = domElementRef?.current;

        let idleTimeout: ReturnType<typeof setTimeout>;
        const handleIdleChange = () => {
            mouseIsIdle.current = false;
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                mouseIsIdle.current = true;
            }, 3500);
        };

        const updateMousePosition = (x: number, y: number) => {
            const canvasBounds = domElementRef.current.getBoundingClientRect();
            const posX = x - canvasBounds.left;
            const posY = y - canvasBounds.top;
            mousePosition.current = [posX, posY];
            normalisedMousePosition.current = [
                posX / canvasBounds.width,
                posY / canvasBounds.height,
            ];

            mouseHasEntered.current = true;
            handleIdleChange();
        };

        const handleMouseDown = (e: MouseEvent) => {
            updateMousePosition(e.clientX, e.clientY);
            mouseIsDown.current = true;
        };

        const handleMouseMove = (e: MouseEvent) => {
            updateMousePosition(e.clientX, e.clientY);
        };

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
            mouseIsDown.current = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
        };

        const handleMouseAndTouchUp = () => {
            mouseIsDown.current = false;
        };

        element?.addEventListener("mousedown", handleMouseDown);
        element?.addEventListener("mousemove", handleMouseMove);
        element?.addEventListener("mouseup", handleMouseAndTouchUp);
        element?.addEventListener("touchstart", handleTouchStart);
        element?.addEventListener("touchmove", handleTouchMove);
        element?.addEventListener("touchend", handleMouseAndTouchUp);

        return () => {
            element?.removeEventListener("mousedown", handleMouseDown);
            element?.removeEventListener("mousemove", handleMouseMove);
            element?.removeEventListener("mouseup", handleMouseAndTouchUp);
            element?.removeEventListener("touchstart", handleTouchStart);
            element?.removeEventListener("touchmove", handleTouchMove);
            element?.removeEventListener("touchend", handleMouseAndTouchUp);
        };
    }, [domElementRef]);

    return {
        elapsedTime,
        frameCount,
        fps: averageFps,
        stopAnimation,
        startAnimation,
        isPlaying,
        mouseHasEntered,
        mousePosition,
        normalisedMousePosition,
        mouseIsDown,
        mouseIsIdle,
    };
};

/**
 * An optional configuration object for `useAnimationFrame`
 */
interface UseAnimationFrameOptions {
    /** A callback that will be run once when the animation starts */
    onStart?: () => void;
    /** A callback that will be run on once when the animation ends */
    onEnd?: () => void;
    /** A delay (in ms) after which the animation will start */
    delay?: number;
    /** A time (in ms) after which the animation will be stopped */
    endAfter?: number;
    /** The desired fps that the animation will be throttled to */
    fps?: number;
    /** Determines if the animation will run or not. Used to invoke the hook without starting an animation. Defaults to true */
    willPlay?: boolean;
    /** A ref to be passed of the dom element that is being animated. Used to get the mouse position over the element */
    domElementRef?: MutableRefObject<HTMLElement>;
}

/**
 * Props for the callback that will be run on every frame of the animation
 */
export interface OnFrameProps {
    /** The current number of elapsed frames */
    frameCount?: number;
    /** The current elapsed time of the animation in ms */
    elapsedTime?: number;
    /** The difference between the current and previous frames in ms */
    deltaTime?: number;
    /** The current fps of the animation (averaged over the last 20 frames) */
    fps?: number;
    /** A function that will stop the animation when called */
    stopAnimation?: () => void;
    /** A function that will restart the animation when called */
    startAnimation?: () => void;
    /** True if the animation is currenty running, otherwise false */
    isPlaying?: boolean;
    /** A boolean that is true if the mouse has interacted with the animation */
    mouseHasEntered?: boolean;
    /** The position of the mouse over the DOM element housing the animation */
    mousePosition?: Vector<2>;
    /** The position of the mouse normalised between 0 and 1 */
    normalisedMousePosition?: Vector<2>;
    /** Whether the mouse is currently pressed */
    mouseIsDown?: boolean;
    /** Whether the mouse has been idle for three seconds */
    mouseIsIdle?: boolean;
}

/**
 * The returned object from `useAnimationFrame`
 */
interface UseAnimationFrameResult {
    /** Reference to the current elapsed time of the animation in ms */
    elapsedTime: MutableRefObject<number>;
    /** Reference to the current number of elapsed frames */
    frameCount: MutableRefObject<number>;
    /** Reference to the current fps of the animation (averaged over the last 10 frames) */
    fps: MutableRefObject<number>;
    /** A function that will stop the animation when called */
    stopAnimation: () => void;
    /** A function that will restart the animation when called */
    startAnimation: () => void;
    /** Reference to a boolean that is true if the animation is currenty running, otherwise false */
    isPlaying: MutableRefObject<boolean>;
    /** Reference to a boolean that is true if the mouse has interacted with the animation */
    mouseHasEntered: MutableRefObject<boolean>;
    /** Reference to the position of the mouse over the DOM element housing the animation */
    mousePosition: MutableRefObject<Vector<2>>;
    /** The position of the mouse normalised between 0 and 1 */
    normalisedMousePosition: MutableRefObject<Vector<2>>;
    /** Reference to whether the mouse is currently pressed */
    mouseIsDown: MutableRefObject<boolean>;
    /** Reference to whether the mouse has been idle for three seconds */
    mouseIsIdle: MutableRefObject<boolean>;
}
