import React from "react";
import type { ReactNode } from "react";
import styled from "@emotion/styled";

import { useRefresh } from "hooks/useRefresh";

const StyledButton = styled.button`
    max-width: max-content;
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
