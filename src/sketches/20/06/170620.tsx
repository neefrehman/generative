import React, { useState, MouseEvent } from "react";
import { styled } from "linaria/react";

import { NoiseOverlay } from "Utils/NoiseOverlay";
import { useAnimationFrame } from "Utils/useAnimationFrame";

const GradientContainer = styled.div`
    width: 100vw;
    height: 100vh;
    --size: 75%;
    --x1: calc(var(--sinFrame) * 2);
    --y1: calc(var(--sinFrame) * 3);
    --x2: calc(var(--cosFrame) * 1.8);
    --y2: calc(var(--cosFrame) * 3);
    --x3: calc(var(--cosFrame) * 3);
    --y3: calc(var(--sinFrame) * 4);
    --x4: calc(var(--cosFrame) * 1.2);
    --y4: calc(var(--sinFrame) * 5);

    background: radial-gradient(
            circle at calc(30% + var(--mouseX) * var(--x1))
                calc(80% + var(--mouseY) * var(--y1)),
            rgba(53, 80, 112, 1) 0%,
            rgba(53, 80, 112, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(20% + var(--mouseX) * calc(var(--x2) * -1))
                calc(30% + var(--mouseY) * var(--y2)),
            rgba(109, 89, 122, 1) 0%,
            rgba(109, 89, 122, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(50% + var(--mouseX) * var(--x3))
                calc(20% + var(--mouseY) * var(--y3)),
            rgba(229, 107, 111, 1) 0%,
            rgba(229, 107, 111, 0) var(--size)
        ),
        radial-gradient(
            circle at calc(90% + var(--mouseX) * var(--x4))
                calc(50% + var(--mouseY) * var(--y4)),
            rgba(234, 122, 109, 1) 0%,
            rgba(234, 122, 109, 0) var(--size)
        );
`;

const S170620 = () => {
    const [mouseX, setMouseX] = useState(0.2);
    const [mouseY, setMouseY] = useState(0.2);

    const { frameCount } = useAnimationFrame();

    const mouseScale = 0.333;
    const updateGradient = (e: MouseEvent<HTMLDivElement>) => {
        const x = e.nativeEvent.offsetX / e.currentTarget.clientWidth - 0.5;
        const y = e.nativeEvent.offsetY / e.currentTarget.clientHeight - 0.5;
        setMouseX(x * mouseScale);
        setMouseY(y * mouseScale);
    };

    return (
        <>
            <NoiseOverlay isAnimated />
            <GradientContainer
                onMouseMove={updateGradient}
                style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
                    "--mouseX": `${mouseX * 100}%`,
                    "--mouseY": `${mouseY * 100}%`,
                    "--sinFrame": Math.sin(frameCount / 62),
                    "--cosFrame": Math.cos(frameCount / 45)
                    // ^replace with CSS trig functions when they arrive: https://www.zdnet.com/article/css-to-get-support-for-trigonometry-functions/
                }}
            />
        </>
    );
};

export default S170620;
