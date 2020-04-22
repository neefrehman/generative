import { styled } from "linaria/react";

const PageWrapper = styled.main`
    margin: 36px 50px;

    header {
        margin-bottom: 35px;
        width: max-content;
        transform: scale(1.02, 1);
        transform-origin: left;
    }

    h1 {
        margin-block-end: 0.5em;
        white-space: nowrap;
        font-size: 3em;
        font-weight: bold;
        margin-right: 1em;

        a {
            text-decoration: underline;
            background-color: initial;

            :hover {
                background-color: #eee;
            }
        }
    }

    @media (max-width: 769px) {
        margin: 25px 30px;

        header {
            margin-bottom: 30px;

            h1 {
                font-size: 2.36em;
            }
        }
    }

    @media (max-width: 425px) {
        margin: 25px 25px;
    }
`;

export default PageWrapper;
