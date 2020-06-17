import React, { useState } from "react";
import { styled } from "linaria/react";

import NoiseOverlay from "SketchUtils/NoiseOverlay";
import useAnimationFrame from "SketchUtils/useAnimationFrame";

const GradientContainer = styled.div`
    width: 100vw;
    height: 100vh;
    --size: 75%;
    --x1: calc(var(--sinFrame) * 4);
    --y1: calc(var(--sinFrame) * 2);
    --x2: calc(var(--cosFrame) * 2.8);
    --y2: calc(var(--cosFrame) * 3);
    --x3: calc(var(--cosFrame) * 2);
    --y3: calc(var(--sinFrame) * 3);
    --x4: calc(var(--cosFrame) * 1.8);
    --y4: calc(var(--sinFrame) * 4);

    background: radial-gradient(
            circle at calc(40% + var(--mouseX) * var(--x1))
                calc(100% + var(--mouseY) * var(--y1)),
            rgba(155, 93, 229, 1) 0%,
            rgba(155, 93, 229, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(0% + var(--mouseX) * calc(var(--x2) * -1))
                calc(0% + var(--mouseY) * var(--y2)),
            rgba(241, 91, 181, 1) 0%,
            rgba(241, 91, 181, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(50% + var(--mouseX) * var(--x3))
                calc(30% + var(--mouseY) * var(--y3)),
            rgba(254, 228, 64, 1) 0%,
            rgba(254, 228, 64, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(85% + var(--mouseX) * var(--x4))
                calc(60% + var(--mouseY) * var(--y4)),
            rgba(0, 187, 249, 1) 0%,
            rgba(0, 187, 249, 0) var(--size)
        );
`;

const s180620 = () => {
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
                    "--sinFrame": Math.sin(frameCount / 25),
                    "--cosFrame": Math.cos(frameCount / 40)
                    // ^replace with CSS trig functions when they arrive: https://www.zdnet.com/article/css-to-get-support-for-trigonometry-functions/
                }}
            />
        </>
    );
};

export default s180620;
