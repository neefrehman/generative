// import React, { useRef, useEffect, ReactNode } from "react";
// import three from "three";
// import { CSSProperties } from "linaria/react";

// interface P5WrapperProps {
//     sketch: () => void;
//     autoResizeToWindow?: boolean;
//     className?: string;
//     style?: CSSProperties;
//     children?: ReactNode | HTMLElement;
// }

// /**
//  * A wrapper component for running three.js sketches. Handles rendering and cleanup.
//  */
// const P5Wrapper = ({
//     sketch,
//     autoResizeToWindow = true,
//     className,
//     style,
//     children
// }: P5WrapperProps) => {
//     const wrapperElement = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         let canvas;

//         if (autoResizeToWindow) {
//             canvas.windowResized = () => {
//                 canvas.resizeCanvas(canvas.windowWidth, canvas.windowHeight);
//             };
//         }

//         return () => canvas.remove();
//     }, [sketch, autoResizeToWindow]);

//     return (
//         <>
//             <div ref={wrapperElement} className={className} style={style} />
//             {children}
//         </>
//     );
// };

// export default P5Wrapper;
