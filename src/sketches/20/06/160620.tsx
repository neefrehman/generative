import React, { useEffect, useRef, useState } from "react";
import { styled } from "linaria/react";

import NoiseOverlay from "SketchUtils/NoiseOverlay";
import useAnimationFrame from "SketchUtils/useAnimationFrame";

const GradientContainer = styled.div`
    width: 100vw;
    height: 100vh;
    --size: 85%;
    --x1: calc(var(--sinFrame) * 3);
    --x2: calc(var(--sinFrame) * 5);
    --x3: calc(var(--sinFrame) * 2);
    --y1: calc(var(--sinFrame) * 4);
    --y2: calc(var(--sinFrame) * 1.6);
    --y3: calc(var(--sinFrame) * 3);

    background: radial-gradient(
            circle at calc(50% + var(--mouseX) * var(--x1))
                calc(100% + var(--mouseY) * var(--y1)),
            rgba(255, 0, 0, 1) 0%,
            rgba(255, 0, 0, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(0% + var(--mouseX) * calc(var(--x2) * -1))
                calc(0% + var(--mouseY) * var(--y2)),
            rgba(0, 255, 0, 1) 0%,
            rgba(0, 255, 0, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(100% + var(--mouseX) * var(--x3))
                calc(0% + var(--mouseY) * var(--y3)),
            rgba(0, 0, 255, 1) 0%,
            rgba(0, 0, 255, 0) var(--size)
        );
`;

const s160620 = () => {
    const wrapper = useRef<HTMLDivElement>();
    const [mouseX, setMouseX] = useState("20%");
    const [mouseY, setMouseY] = useState("20%");

    const { frameCount: frame } = useAnimationFrame();

    useEffect(() => {
        const wrapperEl = wrapper.current;
        const mouseScale = 0.333;

        const updateGradient = (e: MouseEvent) => {
            const x = (e.offsetX / wrapperEl.clientWidth) * 100 - 50;
            const y = (e.offsetY / wrapperEl.clientHeight) * 100 - 50;
            setMouseX(`${(x * mouseScale).toFixed(3)}%`);
            setMouseY(`${(y * mouseScale).toFixed(3)}%`);
        };

        wrapperEl.addEventListener("mousemove", updateGradient);
        return () => wrapperEl.removeEventListener("mousemove", updateGradient);
    }, []);

    return (
        <>
            <NoiseOverlay isAnimated />
            <GradientContainer
                ref={wrapper}
                style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore — https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
                    "--mouseX": mouseX,
                    "--mouseY": mouseY,
                    // replace with trig functions in CSS when they arrive: https://www.zdnet.com/article/css-to-get-support-for-trigonometry-functions/
                    "--sinFrame": Math.sin(frame / 25)
                }}
            />
        </>
    );
};

export default s160620;
