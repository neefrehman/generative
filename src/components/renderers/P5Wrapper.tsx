/* eslint-disable no-new */ /* <- p5 constructor required */
/* eslint-disable new-cap */ /* <- p5 constructor used with lowercase p */
import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import p5 from "p5";
import type { CSSProperties } from "linaria/react";

/**
 * A wrapper component for running P5 sketches. Handles rendering and cleanup.
 */
export const P5Wrapper = ({
    sketch,
    autoResizeToWindow = true,
    className,
    style,
    children
}: P5WrapperProps) => {
    const wrapperElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = new p5(sketch, wrapperElement.current);

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

interface P5WrapperProps {
    sketch: (p: p5) => void;
    autoResizeToWindow?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode | HTMLElement;
}
