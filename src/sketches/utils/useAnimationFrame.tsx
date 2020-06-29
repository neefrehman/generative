import { useEffect, useRef, useState, useCallback } from "react";

import getMean from "./getMean";

/**
 * A custom hook to use `requestAnimationFrame` in a React component
 *
 * @param options - An optional configuration object for the hook
 * @returns An object containing the current elapsedTime, frameCount and fps of the animation, as well as a functions to stop and start the animation
 */
const useAnimationFrame = (
    options: UseAnimationFrameOptions = {}
): UseAnimationFrameResult => {
    const {
        onStart,
        onFrame,
        onEnd,
        delay,
        endAfter,
        fps: throttledFps,
        willPlay = false
    } = options;

    const requestRef = useRef<number>();
    const startTimeRef = useRef<DOMHighResTimeStamp>(performance.now());
    const prevFrameTimeRef = useRef<DOMHighResTimeStamp>(performance.now());

    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [frameCount, setFrameCount] = useState(0);
    const [fpsArray, setFpsArray] = useState<number[]>(
        new Array(10).fill(throttledFps)
    );

    const animate = useCallback(
        (timestamp: DOMHighResTimeStamp) => {
            // FIXME: perf issue on exit when setting state in Raw2d sketches
            // setElapsedTime(Math.round(timestamp - startTimeRef.current));
            const deltaTime = (timestamp - prevFrameTimeRef.current) / 1000;
            const currentFps = Math.round(1 / deltaTime);

            const runFrame = () => {
                // setFpsArray(prevArray => [...[prevArray.shift()], currentFps]);
                // setFrameCount(prevCount => prevCount + 1);
                prevFrameTimeRef.current = timestamp;
                onFrame?.();
            };

            if (throttledFps) {
                if (deltaTime >= 1 / throttledFps) runFrame();
            } else {
                runFrame();
            }

            requestRef.current = requestAnimationFrame(animate);
        },
        [onFrame, throttledFps]
    );

    const startAnimation = () => {
        if (!isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
            setIsPlaying(true);
        }
    };
    const stopAnimation = () => {
        if (isPlaying) {
            cancelAnimationFrame(requestRef.current);
            setIsPlaying(false);
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
    }, [animate, onStart, onEnd, delay, endAfter, willPlay]);

    return {
        elapsedTime,
        frameCount,
        fps: getMean(fpsArray),
        stopAnimation,
        startAnimation,
        isPlaying
    };
};

export default useAnimationFrame;

/**
 * An optional configuration object for `useAnimationFrame`
 */
interface UseAnimationFrameOptions {
    /** A callback that will be run once when the animation starts */
    onStart?: () => void;
    /** A callback that will be run on every frame of the animation */
    onFrame?: () => void;
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
}

/**
 * The returned object from `useAnimationFrame`
 */
interface UseAnimationFrameResult {
    /** The current elapsed time of the animation in ms */
    elapsedTime: number;
    /** The current number of elapsed frames */
    frameCount: number;
    /** The current fps of the animation (averaged over the last 10 frames) */
    fps: number;
    /** A function that will stop the animation when called */
    stopAnimation: () => void;
    /** A function that will restart the animation when called */
    startAnimation: () => void;
    /** True if the animation is currenty running, otherwise false */
    isPlaying: boolean;
}
