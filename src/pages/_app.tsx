import React from "react";
import { ThemeProvider, CacheProvider } from "@emotion/react";
import { AppProps } from "next/app";
import { cache } from "@emotion/css";

import { GlobalStyles } from "styles/GlobalStyles";
import { theme } from "styles/theme";
import { IsDebugProvider } from "context/IsDebug";

const App = ({ Component, pageProps }: AppProps) => (
    <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <IsDebugProvider>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
            </IsDebugProvider>
        </ThemeProvider>
    </CacheProvider>
);

export default App;
