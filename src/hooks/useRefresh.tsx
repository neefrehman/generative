import { useRouter } from "next/router";

/**
 * Will perform a page refresh with Next's `router`.
 * Useful for regenerating sketches without performing a full App
 * relaod, which would lose `isDebug` context.
 */
export const useRefresh = () => {
  const router = useRouter();
  const refresh = () => router.replace(router.asPath);

  return refresh;
};
