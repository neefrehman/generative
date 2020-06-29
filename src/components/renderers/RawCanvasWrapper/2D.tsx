import React, { useRef, useEffect, ReactNode } from "react";
import { CSSProperties } from "linaria/react";

import useAnimationFrame from "SketchUtils/useAnimationFrame";

/**
 * A wrapper component for running 2d vanilla canvas sketches. Handles rendering and cleanup.
 */
const CanvasWrapper2D = ({
    sketch: setupSketch,
    settings,
    className,
    style,
    children
}: CanvasWrapper2DProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const sketchProps = useRef<Canvas2DSketchProps>();
    const drawSketchFn = useRef<Canvas2DDrawFn>();

    const { dimensions, animated, animationSettings = {} } = settings;
    const [width, height] = dimensions;

    const { fps: throttledFps, delay, endAfter } = animationSettings;
    const {
        frameCount,
        elapsedTime,
        fps,
        startAnimation,
        stopAnimation,
        isPlaying
    } = useAnimationFrame({
        willPlay: animated,
        onFrame: () =>
            drawSketchFn.current?.({
                ...sketchProps.current,
                frame: frameCount,
                time: elapsedTime,
                fps,
                startAnimation,
                stopAnimation,
                isPlaying
            }),
        fps: throttledFps,
        delay,
        endAfter
    });

    useEffect(() => {
        const canvasEl = canvas.current;
        const ctx = canvasEl.getContext("2d");

        // <- Start fix - DPR for retina displays ->
        const dpr = window?.devicePixelRatio ?? 1;
        const rect = canvasEl.getBoundingClientRect();
        canvasEl.width = rect.width * dpr;
        canvasEl.height = rect.height * dpr;
        canvasEl.style.width = `${rect.width}px`;
        canvasEl.style.height = `${rect.height}px`;
        ctx.scale(2, 2);
        // <- End fix ->

        const drawSketch = setupSketch();
        const initialSketchProps = {
            ctx,
            canvas: canvasEl,
            width,
            height
        };

        sketchProps.current = initialSketchProps;
        drawSketchFn.current = drawSketch;

        drawSketch(initialSketchProps);

        return () => ctx.clearRect(0, 0, width, height);
    }, [setupSketch, settings]);

    return (
        <>
            <canvas
                ref={canvas}
                width={width}
                height={height}
                className={className}
                style={style}
            />
            {children}
        </>
    );
};

export default CanvasWrapper2D;

/**
 * React props for the CanvasWrapper2D component
 */
interface CanvasWrapper2DProps {
    /** The sketch function to be run */
    sketch: Canvas2DSetupFn;
    /** The setting for the sketch function */
    settings: Canvas2DSettings;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * Settings for the 2d sketch
 */
export interface Canvas2DSettings {
    /** The dimensions for the sketch, in pixels - [width, height] */
    dimensions: [number, number];

    /** Used to set if the sketch will be animated */
    animated?: boolean;
    /** Animation setting for the sketch */
    animationSettings?: {
        /** The desired fps to throttle the sketch to - defaults to 60 */
        fps?: number;
        /** A delay (in ms) after which the animation will start */
        delay?: number;
        /** A time (in ms) after which the animation will be stopped */
        endAfter?: number;
    };
}

/**
 * Props to be recieved inside the sketches returned function
 */
interface Canvas2DSketchProps {
    /** the rendering context to call canvas methods on - in this case 2d */
    ctx: CanvasRenderingContext2D;
    /** The DOM canvas element that is rendering the sketch */
    canvas: HTMLCanvasElement;

    /** The width of the sketch - maps to dimensions[0] from the sketch settings */
    width: number;
    /** The width of the sketch - maps to dimensions[1] from the sketch settings */
    height: number;

    /** The current elapsed time of the animation in ms */
    time?: number;
    /** The current frames of the animation */
    frame?: number;
    /** The current fps of the animation (averaged over the last 10 frames) */
    fps?: number;
    /** True if the animation is currenty running, otherwise false */
    isPlaying?: boolean;
    /** A function that will stop the animation when called */
    stopAnimation?: () => void;
    /** A function that will restart the animation when called */
    startAnimation?: () => void;
}

/**
 * The `sketch` function to be passed into the React compnonent
 */
export type Canvas2DSetupFn = () => Canvas2DDrawFn;

/**
 * The function returned by `Canvas2DSetupFn`, with access to `Canvas2DSketchProps`
 */
type Canvas2DDrawFn = (props: Canvas2DSketchProps) => void;
