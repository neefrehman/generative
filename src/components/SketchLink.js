import React from "react";
import Link from "next/link";
import { styled } from "linaria/react";

const StyledLink = styled.a`
    font-family: helvetica neue, helvetica, arial, sans-serif;
    margin: 0 1em 1em 0;
    width: max-content;
    font-variant-numeric: tabular-nums;
    cursor: pointer;

    /* TODO: add "seen" storage and styling */
    .seen {
        color: #212121;
        background-color: #eee;
    }
`;

const SketchLink = ({ sketchId = "000000" }) => {
    return (
        <Link href="/[sketch]" as={`/${sketchId}`}>
            <StyledLink>{sketchId}</StyledLink>
        </Link>
    );
};

export default SketchLink;
