import React, { useRef, useEffect, ReactNode } from "react";
import { CSSProperties } from "linaria/react";

export interface RawCanvasSettings {
    dimensions: [number, number];
    contextType:
        | "2d"
        | "webgl"
        | "webgl2"
        | "experimental-webgl"
        | "experimental-webgl2"
        | "bitmaprenderer";
}

interface RawCanvasWrapperProps {
    sketch: (ctx: RenderingContext) => void;
    settings?: RawCanvasSettings;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * A wrapper component for running vanilla canvas sketches. Handles rendering and cleanup.
 */
const RawCanvasWrapper = ({
    sketch,
    settings,
    className,
    style,
    children
}: RawCanvasWrapperProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const { dimensions, contextType } = settings;
    const [width, height] = dimensions;

    useEffect(() => {
        const canvasEl = canvas.current;
        const ctx: any = canvasEl.getContext(contextType); // any used to fix BitmapRenderer type error

        if (contextType === "2d") {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvasEl.getBoundingClientRect();
            canvasEl.width = rect.width * dpr;
            canvasEl.height = rect.height * dpr;
            canvasEl.style.width = `${rect.width}px`;
            canvasEl.style.height = `${rect.height}px`;
            ctx.scale(2, 2);
        }

        sketch(ctx);

        return () => {
            contextType === "2d"
                ? ctx.clearRect(0, 0, width, height)
                : (ctx.canvas.width = width);
        };
    }, [sketch, contextType, height, width]);

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

export default RawCanvasWrapper;
