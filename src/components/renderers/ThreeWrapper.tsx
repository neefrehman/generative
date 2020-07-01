import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import three from "three";
import { CSSProperties } from "linaria/react";

interface ThreeWrapperProps {
    sketch: () => void;
    autoResizeToWindow?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}

/**
 * A wrapper component for running three.js sketches. Handles rendering and cleanup.
 */
const ThreeWrapper = ({
    sketch,
    autoResizeToWindow = true,
    className,
    style,
    children
}: ThreeWrapperProps) => {
    const wrapperElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let canvas;

        if (autoResizeToWindow) {
            canvas.windowResized = () => {
                canvas.resizeCanvas(canvas.windowWidth, canvas.windowHeight);
            };
        }

        return () => canvas.remove();
    }, [sketch, autoResizeToWindow]);

    return (
        <>
            <div ref={wrapperElement} className={className} style={style} />
            {children}
        </>
    );
};

export default ThreeWrapper;
