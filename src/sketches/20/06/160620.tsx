import React, { useState } from "react";
import { styled } from "linaria/react";

import NoiseOverlay from "SketchUtils/NoiseOverlay";
import useAnimationFrame from "SketchUtils/useAnimationFrame";

const GradientContainer = styled.div`
    width: 100vw;
    height: 100vh;
    --size: 85%;
    --x1: calc(var(--sinFrame) * 3);
    --y1: calc(var(--sinFrame) * 4);
    --x2: calc(var(--cosFrame) * 4);
    --y2: calc(var(--cosFrame) * 1.6);
    --x3: calc(var(--cosFrame) * 3);
    --y3: calc(var(--sinFrame) * 2);

    background: radial-gradient(
            circle at calc(40% + var(--mouseX) * var(--x1))
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
            circle at calc(70% + var(--mouseX) * var(--x3))
                calc(20% + var(--mouseY) * var(--y3)),
            rgba(0, 0, 255, 1) 0%,
            rgba(0, 0, 255, 0) var(--size)
        );
`;

const S160620 = () => {
    const [mouseX, setMouseX] = useState(0.2);
    const [mouseY, setMouseY] = useState(0.2);

    const { frameCount } = useAnimationFrame();

    const mouseScale = 0.333;
    const updateGradient = e => {
        const x = e.nativeEvent.offsetX / e.target.clientWidth - 0.5;
        const y = e.nativeEvent.offsetY / e.target.clientHeight - 0.5;
        setMouseX(x * mouseScale);
        setMouseY(y * mouseScale);
    };

    return (
        <>
            <NoiseOverlay isAnimated />
            <GradientContainer
                onMouseMove={updateGradient}
                style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore: https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
                    "--mouseX": `${mouseX * 100}%`,
                    "--mouseY": `${mouseY * 100}%`,
                    "--sinFrame": Math.sin(frameCount / 40),
                    "--cosFrame": Math.cos(frameCount / 70)
                    // ^replace with CSS trig functions when they arrive: https://www.zdnet.com/article/css-to-get-support-for-trigonometry-functions/
                }}
            />
        </>
    );
};

export default S160620;
