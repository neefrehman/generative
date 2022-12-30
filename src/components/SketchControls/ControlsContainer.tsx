import React from "react";
import type { ReactNode } from "react";
import { styled } from "linaria/react";

const StyledControlsContainer = styled.div`
  position: fixed;
  top: var(--edgeButtonMargin);
  right: var(--edgeButtonMargin);
  display: flex;
  flex-direction: column;
  text-align: right;
  font-size: 0.95rem;

  > * {
    margin-right: 0;
    margin-left: auto;
    padding: 0.05em 0.2em;
  }

  > *:not(:last-child) {
    margin-bottom: 0.8em;
  }
`;

export const ControlsContainer = ({ children }: { children: ReactNode }) => (
  <StyledControlsContainer>{children}</StyledControlsContainer>
);
