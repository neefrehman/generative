import React from "react";
import type { AppProps } from "next/app";

import { IsDebugProvider } from "context/IsDebug";
import { ReducedMotionAlert } from "components/ReducedMotionAlert";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
    <IsDebugProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <ReducedMotionAlert />
    </IsDebugProvider>
);

export default App;
