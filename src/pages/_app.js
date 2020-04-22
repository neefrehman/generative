import React from "react";
import { css } from "linaria";

const App = ({ Component, pageProps }) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
};

export default App;

export const globalStyles = css`
    :global() {
        @font-face {
            font-family: "Untitled Sans";
            font-weight: normal;
            font-display: block;
            src: url("/static/fonts/UntitledSansWeb-Regular.woff2");
        }

        @font-face {
            font-family: "Untitled Sans";
            font-weight: bold;
            font-display: block;
            src: url("/static/fonts/UntitledSansWeb-Medium.woff2");
        }

        body {
            font-family: "Untitled Sans", helvetica neue, helvetica, arial,
                sans-serif;
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
        }

        *::selection {
            color: #f4cb3d;
        }

        a,
        a:visited {
            text-decoration: none;
            color: #fff;
            display: inline-block;
            background-color: #4a4a4a;
            background-color: rgb(85, 85, 85, 0.7);
            padding: 0 0.1em;
            line-height: normal;
        }

        a:hover {
            color: #212121;
            background-color: #eee;
        }
    }

    @media (max-width: 769px) {
        body {
            font-size: 15px;
        }
    }
`;
