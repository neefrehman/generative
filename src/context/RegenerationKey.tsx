import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/** Global context for debug mode */
export const RegenerationKeyContext = createContext({
  regenerationKey: 0,
  regenerate: () => undefined,
});

/** Global context provider for debug mode */
export const RegenerationKeyProvider = ({ children }: { children: ReactNode }) => {
  const [regenerationKey, setRegenerationKey] = useState(0);
  const regenerate = () => setRegenerationKey(prev => prev + 1);

  const value = useMemo(() => ({ regenerationKey, regenerate }), [regenerationKey]);

  return (
    <RegenerationKeyContext.Provider value={value}>
      {children}
    </RegenerationKeyContext.Provider>
  );
};

export const useRegenerate = () => useContext(RegenerationKeyContext);
