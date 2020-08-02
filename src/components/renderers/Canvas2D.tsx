import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import type { CSSProperties } from "linaria/react";

import { useAnimationFrame } from "Utils/useAnimationFrame";
import type { Vector } from "Utils/math";

import type { DrawProps, RendererSettings } from "./utils/types";

/**
 * A wrapper component for running vanilla 2d canvas sketches. Handles rendering and cleanup.
 */
export const Canvas2DRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children
}: Canvas2DRendererProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const drawProps = useRef<Canvas2DDrawProps>({});
    const drawFunction = useRef<Canvas2DDrawFn>();

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {}
    } = settings;

    const [width, height] = dimensions;

    const { fps: throttledFps, delay, endAfter } = animationSettings;
    const {
        frameCount,
        elapsedTime,
        fps,
        startAnimation,
        stopAnimation,
        isPlaying,
        mouseHasEntered,
        mousePosition
    } = useAnimationFrame({
        willPlay: isAnimated ?? false,
        onFrame: () =>
            drawFunction.current?.({
                ...drawProps.current,
                frame: frameCount.current,
                time: elapsedTime.current,
                fps: fps.current,
                startAnimation,
                stopAnimation,
                isPlaying: isPlaying.current,
                mouseHasEntered: mouseHasEntered.current,
                mousePosition: mousePosition.current
                // onMouseMove, // TODO event callback props
                // onClick
            }),
        fps: throttledFps,
        delay,
        endAfter,
        domElementRef: canvas
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
            mouseHasEntered: false,
            mousePosition: [0, 0] as Vector<2>
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = drawSketch;

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

/**
 * React props for the CanvasWrapper2D component
 */
export interface Canvas2DRendererProps {
    /** The sketch function to be run */
    sketch: Canvas2DSetupFn;
    /** The setting for the sketch function */
    settings?: RendererSettings;

    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * Props to be recieved by the sketch.
 */
type Canvas2DDrawProps = {
    /** the rendering context to call canvas methods on - in this case 2d */
    ctx?: CanvasRenderingContext2D;
    /** The DOM canvas element that is rendering the sketch */
    canvas?: HTMLCanvasElement;
} & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `Canvas2DSketchProps`.
 *
 * Use the contents of this function should contain all sketch state, with the drawing happening
 * inside it's return function.
 */
export type Canvas2DSetupFn = (props?: Canvas2DDrawProps) => Canvas2DDrawFn;

/**
 * The draw function returned by `Canvas2DSetupFn`, with access to `Canvas2DSketchProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type Canvas2DDrawFn = (props?: Canvas2DDrawProps) => void;
