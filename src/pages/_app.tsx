import React from "react";
import type { AppProps } from "next/app";
import { css } from "linaria";

import { IsDebugProvider } from "context/IsDebug";

const App = ({ Component, pageProps }: AppProps) => (
    <IsDebugProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
    </IsDebugProvider>
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
            height: 100vh;
            height: -webkit-fill-available;
            overflow-y: hidden;
            --edgeButtonMargin: clamp(28px, 3vw, 40px);
        }

        h1 {
            font-size: clamp(3em, 4vw, 3.4em);
            font-weight: 400;

            a {
                font-family: inherit;
                text-decoration: underline;
                background-color: initial;

                :hover {
                    background-color: #eee;
                }
            }
        }

        a,
        a:visited,
        button {
            font-family: helvetica neue, helvetica, arial, sans-serif;
            text-decoration: none;
            display: inline-block;
            color: #fff;
            background-color: #4a4a4a;
            border: none;
            padding: 0 0.1em;
            line-height: normal;

            :hover {
                color: #212121;
                background-color: #eee;
            }
        }

        button {
            padding: 0.14em 0.3em;
            cursor: pointer;
        }
    }
`;
