import React, { ReactNode } from "react";
import { styled } from "linaria/react";

const StyledControlsContainer = styled.div`
    position: fixed;
    top: var(--edgeButtonMargin);
    right: var(--edgeButtonMargin);
    text-align: right;
    display: flex;
    flex-direction: column;

    > * {
        margin-right: 0;
        margin-left: auto;
    }

    > *:not(:last-child) {
        margin-bottom: 0.8em;
    }
`;

export const ControlsContainer = ({ children }: { children: ReactNode }) => (
    <StyledControlsContainer>{children}</StyledControlsContainer>
);
