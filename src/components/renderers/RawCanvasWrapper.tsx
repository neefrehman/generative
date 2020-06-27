import React, { useRef, useEffect, ReactNode } from "react";
import { CSSProperties } from "linaria/react";

interface RawCanvasWrapperProps {
    contextType:
        | "2d"
        | "webgl"
        | "webgl2"
        | "experimental-webgl"
        | "experimental-webgl2"
        | "bitmaprenderer";
    sketch: (ctx: RenderingContext) => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * A wrapper component for running vanilla canvas sketches. Handles rendering and cleanup.
 */
const RawCanvasWrapper = ({
    contextType,
    sketch,
    className,
    style,
    children
}: RawCanvasWrapperProps) => {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvasEl = canvas.current;
        const ctx = canvasEl.getContext(contextType);
        sketch(ctx);

        return () => canvasEl.remove();
    }, [contextType, sketch]);

    return (
        <>
            <canvas ref={canvas} className={className} style={style} />
            {children}
        </>
    );
};

export default RawCanvasWrapper;
