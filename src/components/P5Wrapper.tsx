/* eslint-disable no-new */
/* eslint-disable new-cap */
import React, { useRef, useEffect, ReactNode } from "react";
import p5 from "p5/lib/p5.min"; // TODO: alias minified version: https://github.com/processing/p5.js/issues/2920

interface P5WrapperProps {
    sketch: (p: p5) => void;
    resizable?: boolean;
    children?: ReactNode | HTMLElement;
}

const P5Wrapper = ({ sketch, resizable = true, children }: P5WrapperProps) => {
    const wrapperElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = new p5(sketch, wrapperElement.current);

        if (resizable) {
            canvas.windowResized = () => {
                canvas.resizeCanvas(canvas.windowWidth, canvas.windowHeight);
            };
        }

        return () => canvas.remove();
    }, []);

    return (
        <>
            <div ref={wrapperElement} />
            {children}
        </>
    );
};

export default P5Wrapper;
