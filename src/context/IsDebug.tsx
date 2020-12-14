import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "hooks/useIsomorphicLayouteffect";

/** Global context for debug mode */
export const IsDebugContext = createContext(false);

/** Global context provider for debug mode */
export const IsDebugProvider = ({ children }: { children: ReactNode }) => {
    const [isDebug, setIsDebug] = useState(process.env.NODE_ENV === "development");

    useIsomorphicLayoutEffect(() => {
        if (isDebug === true) return;

        const searchParams = new URLSearchParams(window.location.search);
        const debugQuery = searchParams.get("debug");
        const acceptedQueryValues = ["", "true"]; // `/?debug` || `/?debug=true`
        const debugInParams = acceptedQueryValues.includes(debugQuery);

        setIsDebug(debugInParams);
    }, [isDebug]);

    return (
        <IsDebugContext.Provider value={isDebug}>
            {children}
        </IsDebugContext.Provider>
    );
};
