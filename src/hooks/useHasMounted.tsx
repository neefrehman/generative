import { useEffect, useState } from "react";

/**
 * Returns true when the component has mounted
 */
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  return hasMounted;
};
