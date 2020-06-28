import React, { useRef, useEffect, ReactNode } from "react";
import canvasSketch from "canvas-sketch";
import { CSSProperties } from "linaria/react";

interface CanvasSketchWrapperProps {
    sketch: CanvasSketchSketchFunction<RenderingContext>;
    settings?: CanvasSketchSettings;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * A wrapper component for running canvas-sketch sketches. Handles rendering and cleanup.
 */
const CanvasSketchWrapper = ({
    sketch,
    settings: rawSettings,
    className,
    style,
    children
}: CanvasSketchWrapperProps) => {
    const wrapper = useRef<HTMLDivElement>(null);

    // <- START FIX ->
    // for blurred sketches - seems like canvas-sketch doesn't
    // handle resizing for DPR without canvas-sketch-cli?
    const { dimensions } = rawSettings;
    const dpr = window.devicePixelRatio || 1;

    const doubledSize = Array.isArray(dimensions)
        ? dimensions.map(dimension => dimension * dpr) // <- double canvas dimensions to solve blur
        : null;
    const usedDimensions = Array.isArray(dimensions) ? doubledSize : dimensions;

    const canvasMarginDeviation = 80; // <- Required hack to ensure canvas is right size for some reason
    const containerWidth = Array.isArray(dimensions)
        ? dimensions[0] + canvasMarginDeviation // <- halve container width to double DPR
        : null;
    const containerHeight = Array.isArray(dimensions)
        ? dimensions[0] + canvasMarginDeviation // <- halve container height to double DPR
        : null;
    // <- END FIX ->

    useEffect(() => {
        const sketchSettings = {
            ...rawSettings,
            parent: wrapper.current,
            dimensions: usedDimensions // <- overwritten dimensions
        };
        const canvas = canvasSketch(sketch, sketchSettings);

        const wrapperEl = wrapper.current;
        return () => wrapperEl.querySelector("canvas").remove(); // canvas.unload() not working - https://github.com/mattdesl/canvas-sketch/blob/master/docs/api.md#sketchmanager;
    }, [sketch, rawSettings, doubledSize, dimensions, usedDimensions]);

    return (
        <>
            <div
                ref={wrapper}
                className={className}
                style={{
                    width: containerWidth, // <- halved width
                    height: containerHeight, // <- halved height
                    ...style
                }}
            />
            {children}
        </>
    );
};

export default CanvasSketchWrapper;

// <- TYPES ->
export type TwoD = CanvasRenderingContext2D;
export type WebGL = WebGLRenderingContext;
export type WebGL2 = WebGL2RenderingContext;
export type ImageBitMap = ImageBitmapRenderingContext;

export type CanvasSketchSketchFunction<Context extends RenderingContext> = (
    props: CanvasSketchProps<Context>
) => void;

export interface CanvasSketchProps<Context extends RenderingContext> {
    units: string;
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
    styleWidth: number;
    styleHeight: number;
    scaleX: number;
    scaleY: number;
    pixelRatio: number;
    pixelsPerInch: number;

    canvas: HTMLCanvasElement;
    context: Context;

    time: number;
    frame: number;
    playhead: number;
    deltaTime: number;
    playing: boolean;
    duration: number;
    totalFrames: number;
    fps: number;

    exporting: boolean;
    recording: boolean;
    settings: CanvasSketchSettings;
    render: () => void;
    update: (obj: CanvasSketchSettings) => void;
    exportFrame: (obj: any) => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
    togglePlay: () => void;
}

export interface CanvasSketchSettings {
    dimensions: [number, number] | string;
    units?: string;
    pixelsPerInch?: number;
    orientation?: "initial" | "landscape" | "portrait";
    scaleToFit?: boolean;
    scaleToView?: boolean;
    bleed?: number;
    pixelRatio?: number;
    exportPixelRatio?: number;
    maxPixelRatio?: number;
    scaleContext?: boolean;
    resizeCanvas?: boolean;
    styleCanvas?: boolean;

    canvas?: HTMLCanvasElement;
    context?: string | CanvasRenderingContext2D | WebGLRenderingContext;
    attributes?: Record<string, unknown>;
    parent?: HTMLElement | boolean;

    file?: string; // | () => void; // how do I type string or function?
    name?: string;
    prefix?: string;
    suffix?: string;
    encoding?: string;
    encodingQuality?: number;

    animate?: boolean;
    playing?: boolean;
    loop?: boolean;
    duration?: number;
    totalFrames?: number;
    fps?: number;
    playbackRate?: string;
    timeScale?: number;
    frame?: number;
    time?: number;

    flush?: boolean;
    pixelated?: boolean;
    hotkeys?: boolean;
    p5?: boolean; // | p5; // typing for a p5 instance would add too much to this file when bundled, and can't import from @types/p5
    id?: string;
    data?: any;
}
