import { styled } from "linaria/react";

const LargeTextOverlay = styled.p`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%) scale(1.05, 1);
    transform-origin: center;
    margin-block-start: 0;

    font-size: 6em;
    font-weight: bold;
    letter-spacing: -1px;
    color: #616161;
    opacity: 0.75;
    text-transform: uppercase;

    @media (max-width: 769px) {
        font-size: 4em;
    }
`;

export default LargeTextOverlay;
