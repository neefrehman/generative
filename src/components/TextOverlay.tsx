import React, { useState, useEffect } from "react";
import { styled } from "linaria/react";

import useTimeout from "hooks/useTimeout";

const StyledText = styled.p`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%) scale(1.05, 1);
    transform-origin: center;
    margin-block-start: 0;

    font-size: clamp(4em, 10vw, 6.4em);
    letter-spacing: -1px;
    color: #616161;
    opacity: 0.75;
    text-transform: uppercase;
    text-align: center;
`;

interface TextOverlayProps {
    text: string;
    /** The amount of time in ms to wait before hiding the overlay. Defaults to 500ms */
    timeout?: number | boolean;
}

export const TextOverlay = ({ text, timeout }: TextOverlayProps) => {
    const [isVisible, setIsVisible] = useState(true);

    const timeoutMs = typeof timeout === "number" ? timeout : 1500;
    useTimeout(() => timeout && setIsVisible(false), timeoutMs);

    return <>{isVisible && <StyledText>{text}</StyledText>}</>;
};
