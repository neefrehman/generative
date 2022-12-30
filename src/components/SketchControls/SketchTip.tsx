import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { styled } from "linaria/react";

const StyledTipContainer = styled.div<{ isVisible: boolean }>`
  overflow-x: hidden;
  padding: 0;

  > div {
    border: none;
    font-family: helvetica neue, helvetica, arial, sans-serif;
    padding: 0.05em 0.5em;
    background-color: rgb(85, 85, 85, 0.7);

    transform: translateX(
      ${({ isVisible }) => (isVisible ? 0 : "calc(100% - 1.3em)")}
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
      background-color: var(--offWhite);
      color: var(--offBlack);
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
    let shrinkTimeout: ReturnType<typeof setTimeout>;

    const sketchPath = window.location.pathname;
    const userHasVisitedSketch = localStorage.getItem(`${sketchPath}.visited`);

    if (userHasVisitedSketch !== "true") {
      localStorage.setItem(`${sketchPath}.visited`, "true");
      setIsVisible(true);
      shrinkTimeout = setTimeout(() => setIsVisible(false), timeout);
    }

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
