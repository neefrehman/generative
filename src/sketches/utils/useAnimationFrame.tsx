import { useEffect, useRef, useState } from "react";

/**
 * A custom hook to use `requestAnimationFrame` in a React component
 *
 * @param callback A function to be called every frame
 * @returns The current `frameCount` of the animation
 */
const useAnimationFrame = (callback?: () => void) => {
    const requestRef = useRef<number>();
    const [frameCount, setFrameCount] = useState(0);

    const animate = () => {
        callback?.();
        setFrameCount(prevCount => prevCount + 1);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return { frameCount };
};

export default useAnimationFrame;
