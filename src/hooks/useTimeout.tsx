import { useEffect } from "react";

/**
 * Selects the correct React effect hook depending on if it will be
 * run by SSR or the browser. This helps to avoid `useLayoutEffect
 * does nothing on the server` warnings.
 *
 */
const useTimeout = (callback: (...args: never[]) => void, timeout: number) => {
    useEffect(() => {
        let timeoutFunction: ReturnType<typeof setTimeout>;

        timeoutFunction = setTimeout(() => callback(), timeout);

        return () => clearTimeout(timeoutFunction);
    }, [callback, timeout]);
};

export default useTimeout;
