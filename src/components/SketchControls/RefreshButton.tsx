import React from "react";
import type { ReactNode } from "react";
import { styled } from "linaria/react";

import { useRefresh } from "hooks/useRefresh";

const StyledButton = styled.button`
    max-width: max-content;
    background-color: rgb(85, 85, 85, 0.7);
`;

interface RefreshButtonProps {
    children?: ReactNode;
}

export const RefreshButton = ({ children }: RefreshButtonProps) => {
    const refresh = useRefresh();

    return (
        <StyledButton onClick={refresh}>{children ?? "Regenerate"}</StyledButton>
    );
};
