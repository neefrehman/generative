import React, { useRef, useEffect } from "react";
import type { ReactNode, MouseEvent, TouchEvent } from "react";
import type { CSSProperties } from "linaria/react";

import { useAnimationFrame } from "Utils/useAnimationFrame";
import type { Vector } from "Utils/math";

/**
 * A wrapper component for running vanilla 2d canvas sketches. Handles rendering and cleanup.
 */
export const CanvasWrapper2D = ({
    sketch: setupSketch,
    settings,
    className,
    style,
    children
}: CanvasWrapper2DProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const drawProps = useRef<Canvas2DDrawProps>();
    const drawFunction = useRef<Canvas2DDrawFunction>();

    const { dimensions, isAnimated, animationSettings = {} } = settings;
    const [width, height] = dimensions;

    const mousePosition = useRef<Vector<2>>([width / 2, height / 2]); // TODO: look into rerender perf issues with state

    const { fps: throttledFps, delay, endAfter } = animationSettings;
    const {
        frameCount,
        elapsedTime,
        fps,
        startAnimation,
        stopAnimation,
        isPlaying
    } = useAnimationFrame({
        willPlay: isAnimated ?? false,
        onFrame: () =>
            drawFunction.current?.({
                ...drawProps.current,
                frame: frameCount,
                time: elapsedTime,
                fps,
                startAnimation,
                stopAnimation,
                isPlaying,
                mousePosition: mousePosition.current
                // onMouseMove, // TODO event callback props
                // onClick
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

        const initialSketchProps = {
            ctx,
            canvas: canvasEl,
            width,
            height,
            mousePosition: mousePosition.current
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = drawSketch;

        drawSketch(initialSketchProps);

        return () => ctx.clearRect(0, 0, width, height);
    }, [setupSketch, settings]);

    const updateMousePosition = (x: number, y: number) => {
        const canvasBounds = canvas.current.getBoundingClientRect();
        const posX = x - canvasBounds.left;
        const posY = y - canvasBounds.top;
        mousePosition.current = [posX, posY];
    };

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        updateMousePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
    };

    return (
        <>
            <canvas
                ref={canvas}
                width={width}
                height={height}
                className={className}
                style={style}
                onMouseMove={isAnimated && handleMouseMove}
                onTouchMove={isAnimated && handleTouchMove}
            />
            {children}
        </>
    );
};

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
    isAnimated?: boolean;
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
interface Canvas2DDrawProps {
    /** the rendering context to call canvas methods on - in this case 2d */
    ctx?: CanvasRenderingContext2D;
    /** The DOM canvas element that is rendering the sketch */
    canvas?: HTMLCanvasElement;

    /** The width of the sketch - maps to dimensions[0] from the sketch settings */
    width?: number;
    /** The width of the sketch - maps to dimensions[1] from the sketch settings */
    height?: number;

    /** The current frames of the animation */
    frame?: number;
    /** The current elapsed time of the animation in ms */
    time?: number;
    /** The current fps of the animation (averaged over the last 10 frames) */
    fps?: number;
    /** A function that will stop the animation when called */
    stopAnimation?: () => void;
    /** A function that will restart the animation when called */
    startAnimation?: () => void;
    /** True if the animation is currenty running, otherwise false */
    isPlaying?: boolean;

    /** A vector of current position of the mouse over the canvas - [mouseX, mouseY] */
    mousePosition?: Vector<2>;

    /** A callback that will be run every time the mouse moves across the canvas */
    onMouseMove?: () => void;
    /** A callback that will be run every time the user clicks on the canvas */
    onClick?: () => void;
}

/**
 * The `sketch` function to be passed into the React compnonent
 */
export type Canvas2DSetupFn = (
    props?: Canvas2DDrawProps
) => Canvas2DDrawFunction;

/**
 * The draw function returned by `Canvas2DSetupFn`, with access to `Canvas2DSketchProps`
 */
type Canvas2DDrawFunction = (props?: Canvas2DDrawProps) => void;
