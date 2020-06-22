import { useEffect, useRef, useState, useCallback } from "react";

import getMean from "./getMean";

/**
 * A custom hook to use `requestAnimationFrame` in a React component
 *
 * @param config - An optional configuration object for the hook
 * @param config.onStart - A callback that will be run once when the animation starts
 * @param config.onFrame - A callback that will be run on every frame of the animation
 * @param config.onEnd - A callback that will be run on once when the animation ends
 * @param config.delay - A delay in ms after which the animation will start
 * @param config.endAfter - A time in ms after which the animation will be stopped
 * @param config.fps - The desired fps that the animation will be throttled to
 *
 * @returns An object containing the current elapsedTime, frameCount and fps of the animation, as well as a function to stop the animation
 */
const useAnimationFrame = ({
    onStart,
    onFrame,
    onEnd,
    delay,
    endAfter,
    fps: throttledFps
}: {
    onStart?: () => void;
    onFrame?: () => void;
    onEnd?: () => void;
    delay?: number;
    endAfter?: number;
    fps?: number;
} = {}) => {
    const requestRef = useRef<number>();
    const startTimeRef = useRef<DOMHighResTimeStamp>(performance.now());
    const prevFrameTimeRef = useRef<DOMHighResTimeStamp>(performance.now());

    const [elapsedTime, setElapsedTime] = useState(0);
    const [frameCount, setFrameCount] = useState(0);
    const [fpsArray, setFpsArray] = useState<number[]>(
        new Array(10).fill(throttledFps)
    );

    const animate = useCallback(
        (timestamp: DOMHighResTimeStamp) => {
            setElapsedTime(Math.round(timestamp - startTimeRef.current));
            const deltaTime = (timestamp - prevFrameTimeRef.current) / 1000;
            const currentFps = Math.round(1 / deltaTime);

            const runFrame = () => {
                onFrame?.();
                setFpsArray(prevArray => [...[prevArray.shift()], currentFps]);
                setFrameCount(prevCount => prevCount + 1);
                prevFrameTimeRef.current = timestamp;
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

    useEffect(() => {
        setTimeout(() => {
            requestRef.current = requestAnimationFrame(animate);
            onStart?.();
        }, delay ?? 0);

        if (endAfter) {
            setTimeout(() => {
                cancelAnimationFrame(requestRef.current);
                onEnd?.();
            }, endAfter);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [animate, onStart, onEnd, delay, endAfter]);

    const endAnimation = () => cancelAnimationFrame(requestRef.current);

    return { elapsedTime, frameCount, fps: getMean(fpsArray), endAnimation };
};

export default useAnimationFrame;
