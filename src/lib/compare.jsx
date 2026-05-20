import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const MAX = 4;
const KEY = "aithusiast:compare";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  const has = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id) => {
      setIds((cur) => {
        if (cur.includes(id)) return cur.filter((x) => x !== id);
        if (cur.length >= MAX) return cur; // ignore beyond max
        return [...cur, id];
      });
    },
    []
  );
  const remove = useCallback((id) => setIds((cur) => cur.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, has, toggle, remove, clear, max: MAX }),
    [ids, has, toggle, remove, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
