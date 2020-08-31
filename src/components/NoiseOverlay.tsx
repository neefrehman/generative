import React from "react";
import { styled } from "linaria/react";

const SVG = styled.svg`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    pointer-events: none;
`;

/**
 * Adds an svg noise overlay to achieve a film-like grain effect
 */
export const NoiseOverlay = ({
    width = "100vw",
    height = "100vh",
    opacity = 0.15,
    grainSize = 0.62,
    isAnimated,
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

interface NoiseProps {
    /** The overlay's width */
    width?: string;
    /** he overlay's height */
    height?: string;
    /** The overlay's opacity (noise strength) — a number between 0 and 1 */
    opacity?: number;
    /** The size of the grain (noise size) — a number between 0 and 1 */
    grainSize?: number;
    /** Animates the noise to achieve a TV static-like effect */
    isAnimated?: boolean;
}
