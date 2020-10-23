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

        html {
            height: -webkit-fill-available;
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
            min-height: 100vh;
            min-height: -webkit-fill-available;
            overflow-y: hidden;
            --edgeButtonMargin: clamp(28px, 3vw, 40px);
        }

        h1 {
            font-size: clamp(2.7em, 4vw, 3.4em);
            font-weight: 400;
        }

        a,
        a:visited,
        button {
            font-family: helvetica neue, helvetica, arial, sans-serif;
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
`;
