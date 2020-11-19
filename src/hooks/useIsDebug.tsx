import { useRouter } from "next/router";

/**
 * A custom hook to activate debug mode (detected from a browser query or node environment).
 */
export const useIsDebug = (): boolean => {
    const router = useRouter();
    const isDebug =
        process.env.NODE_ENV === "development" || router.query.debug !== undefined;

    return isDebug;
};
