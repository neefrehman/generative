import React from "react";
import type { AppProps } from "next/app";
import { css } from "linaria";

const App = ({ Component, pageProps }: AppProps) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />
);

export default App;

export const globalStyles = css`
    :global() {
        @font-face {
            font-family: "Fleuron";
            font-weight: normal;
            font-display: block;
            src: url("/static/fonts/fleuronregular.woff2");
        }

        * {
            margin: 0;
        }

        body {
            font-family: "Fleuron", helvetica neue, helvetica, arial, sans-serif;
            font-size: 16px;
            line-height: 1.2;
            color: #ffffff;
            background-color: #212121;
            text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
            max-width: max-content;
            margin: 0;
            padding: 0;
            overflow-y: hidden;

            --edgeButtonMargin: 40px;
        }

        a,
        a:visited,
        button {
            text-decoration: none;
            display: inline-block;
            color: #fff;
            background-color: #4a4a4a;
            padding: 0 0.1em;
            line-height: normal;

            :hover {
                color: #212121;
                background-color: #eee;
            }
        }
    }

    @media (max-width: 769px) {
        body {
            font-size: 15px;
            --edgeButtonMargin: 30px;
        }
    }
`;
