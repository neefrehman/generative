import React from "react";
import type { AppProps } from "next/app";

import { IsDebugProvider } from "context/IsDebug";
import { RegenerationKeyProvider } from "context/RegenerationKey";
import { ReducedMotionAlert } from "components/ReducedMotionAlert";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => (
  <IsDebugProvider>
    <RegenerationKeyProvider>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
      <ReducedMotionAlert />
    </RegenerationKeyProvider>
  </IsDebugProvider>
);

export default App;
