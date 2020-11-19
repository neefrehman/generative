import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

/** Global context for debug mode */
export const IsDebugContext = createContext(false);

/** Global context provider for debug mode */
export const IsDebugProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isDebug, setIsDebug] = useState(
        process.env.NODE_ENV === "development" || router.query.debug === "true"
    );

    useEffect(() => {
        if (isDebug === true) return; // Early return persists state for duration of session
        setIsDebug(router.query.debug === "true");
    }, [isDebug, router.query.debug]);

    return (
        <IsDebugContext.Provider value={isDebug}>
            {children}
        </IsDebugContext.Provider>
    );
};
