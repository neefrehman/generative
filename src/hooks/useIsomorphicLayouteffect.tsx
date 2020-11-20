import { useEffect, useLayoutEffect } from "react";

/**
 * Selects the correct React effect hook depending on if it will be
 * run by SSR or the browser. This helps to avoid `useLayoutEffect
 * does nothing on the server` warnings.
 *
 * @link https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#gistcomment-3318852
 * @link https://medium.com/alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
 */
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
