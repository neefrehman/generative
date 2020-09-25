import React, { useState, useEffect, ReactNode } from "react";
import { styled } from "linaria/react";

const StyledTipContainer = styled.div<{ isVisible: boolean }>`
    position: fixed;
    top: var(--edgeButtonMargin);
    right: var(--edgeButtonMargin);
    text-align: right;
    overflow-x: hidden;

    div {
        border: none;
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

        :hover,
        :focus,
        :focus-within {
            transform: translateX(0);
            background-color: #eee;
            color: #212121;
        }

        /* :focus {outline: none;} */
        /* :focus-visible {outline: initial;} */

        a {
            text-decoration: underline;
            color: inherit;
            background-color: inherit;

            :hover {
                text-decoration: none;
            }
        }
    }
`;

interface SketchTipProps {
    children: ReactNode;
    timeout?: number;
}

export const SketchTip = ({ children, timeout = 3000 }: SketchTipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const shrinkTimeout = setTimeout(() => setIsVisible(false), timeout);
        return () => clearTimeout(shrinkTimeout);
    }, [timeout]);

    return (
        <StyledTipContainer isVisible={isVisible}>
            <div
                role="button"
                aria-label="info"
                aria-expanded={isVisible}
                tabIndex={0}
                onTouchStart={() => setIsVisible(true)}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
            >
                <span role="tooltip">{children}</span>
            </div>
        </StyledTipContainer>
    );
};
