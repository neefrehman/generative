import React, { useState, useEffect } from "react";
import { styled } from "linaria/react";

const StyledTip = styled.div<{ isVisible: boolean }>`
    --edgeMargin: 40px;
    position: fixed;
    top: var(--edgeMargin);
    right: var(--edgeMargin);
    text-align: right;
    overflow-x: hidden;

    a {
        font-family: helvetica neue, helvetica, arial, sans-serif;
        font-size: 0.95em;
        padding: 0.05em 0.5em;
        background-color: rgb(85, 85, 85, 0.7);

        transform: translateX(
            ${props => (props.isVisible ? 0 : "calc(100% - 1.5em)")}
        );
        transition: transform 500ms;

        ::before {
            content: "i";
            font-size: 0.9em;
            font-family: monaco, monospace;
            padding: 0 0.5em 0 0;
        }

        :hover {
            transform: translateX(0);
            background-color: #eee;
        }
    }

    @media (max-width: 769px) {
        --edgeMargin: 33px;
    }
`;

interface SketchTipProps {
    tip: string;
}

export const SketchTip = ({ tip }: SketchTipProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const TIMEOUT_MS = 2500;

    useEffect(() => {
        const shrinkTimeout = setTimeout(() => setIsVisible(false), TIMEOUT_MS);
        return () => clearTimeout(shrinkTimeout);
    }, [TIMEOUT_MS]);

    return (
        <StyledTip isVisible={isVisible}>
            <a>{tip}</a>
        </StyledTip>
    );
};
