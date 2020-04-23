import React, { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "linaria";
import { styled } from "linaria/react";

const StyledLink = styled.a`
    font-family: helvetica neue, helvetica, arial, sans-serif;
    margin: 0 1em 1em 0;
    width: max-content;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
`;

const vistedStyles = css`
    color: #212121;
    background-color: #eee;
`;

const SketchLink = ({ sketchId = "000000", visited }) => {
    const [highlighted, setHighlighted] = useState(false);

    useEffect(() => {
        if (visited) setHighlighted(true);
    }, [visited]);

    return (
        <Link href="/[sketch]" as={`/${sketchId}`}>
            {/* `visited && visitedStyles` won't work here due to Next hydration conflicts */}
            <StyledLink className={highlighted && vistedStyles}>
                {sketchId}
            </StyledLink>
        </Link>
    );
};

export default SketchLink;
