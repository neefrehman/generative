import React, { ReactNode } from "react";
import { styled } from "linaria/react";

import { useRefresh } from "hooks/useRefresh";

const StyledButton = styled.button`
    max-width: max-content;
`;

interface RefreshButtonProps {
    children?: ReactNode;
}

export const RefreshButton = ({ children }: RefreshButtonProps) => {
    const refresh = useRefresh();

    return <StyledButton onClick={refresh}>{children}</StyledButton>;
};
