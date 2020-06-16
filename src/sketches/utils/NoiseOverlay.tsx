import React from "react";
import { styled } from "linaria/react";

const SVG = styled.svg`
    position: fixed;
    z-index: 5;
    pointer-events: none;
`;

interface NoiseProps {
    width?: string;
    height?: string;
    opacity?: number;
    grainSize?: number;
    isAnimated?: boolean;
}

/**
 * Adds an svg noise overlay to the page to achieve a film-like grain effect
 *
 * @param {string} width The overlay's width
 * @param {string} height The overlay's height
 * @param {number} opacity The overlay's opacity (noise strength) — a number between 0 and 1
 * @param {number} grainSize The size of the grain (noise size) — a number between 0 and 1
 * @param {boolean} isAnimated Animates the noise to achieve a static effect
 */
const NoiseOverlay = ({
    width = "100vw",
    height = "100vh",
    opacity = 0.15,
    grainSize = 0.62,
    isAnimated
}: NoiseProps) => (
    <SVG width={width} height={height}>
        <filter id="noise" x="0" y="0">
            <feTurbulence
                type="fractalNoise"
                baseFrequency={grainSize.toString()}
                seed="10"
                stitchTiles="stitch"
            >
                {isAnimated && (
                    <animate
                        attributeName="seed"
                        dur="1s"
                        values="10;0;10"
                        repeatCount="indefinite"
                    />
                )}
            </feTurbulence>
        </filter>
        <rect
            width="100%"
            height="100%"
            filter="url(#noise)"
            opacity={opacity}
        />
    </SVG>
);

export default NoiseOverlay;
