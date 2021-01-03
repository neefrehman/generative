import React, { useRef, useEffect } from "react";

import { useAnimationFrame } from "hooks/useAnimationFrame";

import { fixDevicePixelRatio } from "LibUtils/canvas2d";

import type {
    RendererProps,
    RendererSettings,
    DrawProps,
    SetupFn,
    DrawFn,
} from "./types";

/**
 * A wrapper component for running vanilla 2D canvas sketches. Handles rendering and cleanup.
 */
export const Canvas2DRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children,
}: Canvas2DRendererProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawProps = useRef<Canvas2DDrawProps>({} as Canvas2DDrawProps);
    const drawFunction = useRef<Canvas2DDrawFn>();

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {},
    } = settings;

    const [width, height] = dimensions;
    const { fps: throttledFps, delay, endAfter } = animationSettings;

    const { startAnimation, stopAnimation } = useAnimationFrame(
        animationProps =>
            drawFunction.current?.({
                ...drawProps.current,
                frameCount: animationProps.frameCount,
                elapsedTime: animationProps.elapsedTime,
                fps: animationProps.fps,
                startAnimation,
                stopAnimation,
                isPlaying: animationProps.isPlaying,
                mouseHasEntered: animationProps.mouseHasEntered,
                mousePosition: animationProps.mousePosition,
                mouseIsDown: animationProps.mouseIsDown,
                mouseIsIdle: animationProps.mouseIsIdle,
            }),
        {
            willPlay: isAnimated,
            fps: throttledFps,
            delay,
            endAfter,
            domElementRef: canvasRef,
        }
    );

    useEffect(() => {
        const canvasEl = canvasRef.current;
        const ctx = canvasEl.getContext("2d");
        fixDevicePixelRatio(canvasEl, ctx);

        const initialSketchProps: Canvas2DDrawProps = {
            ctx,
            canvas: canvasEl,
            width,
            height,
            aspect: width / height,
            mouseHasEntered: false,
            mousePosition: [0, 0],
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = drawSketch;

        return () => ctx.clearRect(0, 0, width, height);
    }, [setupSketch, settings, width, height]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={className}
                style={style}
            />
            {children}
        </>
    );
};

// <- TYPES ->

export type Canvas2DRendererProps = RendererProps<Canvas2DSetupFn>;

/**
 * Settings for the Canvas 2D sketch
 */
export type { RendererSettings as Canvas2DRendererSettings };

/**
 * Props to be recieved by the Canvas 2D sketch.
 */
export type Canvas2DDrawProps = {
    /** the rendering context to call canvas methods on - in this case 2d */
    ctx: CanvasRenderingContext2D;
    /** The DOM canvas element that is rendering the sketch */
    canvas: HTMLCanvasElement;
} & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `Canvas2DDrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type Canvas2DSetupFn = SetupFn<Canvas2DDrawProps, Canvas2DDrawFn>;

/**
 * The draw function returned by `Canvas2DSetupFn`, with access to `Canvas2DSketchProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type Canvas2DDrawFn = DrawFn<Canvas2DDrawProps>;
