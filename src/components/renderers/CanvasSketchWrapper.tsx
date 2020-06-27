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

    useEffect(() => {
        const settings = {
            parent: wrapper.current,
            ...rawSettings
        };
        const canvas = canvasSketch(sketch, settings);

        const wrapperEl = wrapper.current;
        return () => wrapperEl.querySelector("canvas").remove(); // canvas.unload() not working - https://github.com/mattdesl/canvas-sketch/blob/master/docs/api.md#sketchmanager;
    }, [sketch, rawSettings]);

    // Fix for blur
    const halvedDimensions = Array.isArray(rawSettings.dimensions)
        ? rawSettings.dimensions.map(dimension => dimension / 2)
        : null;

    return (
        <>
            <div
                ref={wrapper}
                className={className}
                style={{
                    width: halvedDimensions[0],
                    height: halvedDimensions[1],
                    ...style
                }}
            />
            {children}
        </>
    );
};

export default CanvasSketchWrapper;

// Types
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
    dimensions?: [number, number] | string;
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
    attributes?: Object;
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
    p5?: boolean; // | p5; typing for a p5 instance would add too much to this file when bundled, and can't import from @types/p5
    id?: string;
    data?: any;
}
