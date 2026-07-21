import React, { createContext, useContext, useCallback, useState, useRef, useMemo } from "react";

interface FilterUIContext {
  showFilter: boolean;
  onOpenFilters: (() => void) | null;
  activeFilterCount: number;
  setShowFilter: (show: boolean) => void;
  setOpenCallback: (cb: (() => void) | null) => void;
  setActiveFilterCount: (count: number) => void;
}

const FilterUIContext = createContext<FilterUIContext>({
  showFilter: false,
  onOpenFilters: null,
  activeFilterCount: 0,
  setShowFilter: () => {},
  setOpenCallback: () => {},
  setActiveFilterCount: () => {},
});

export const FilterUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showFilter, setShowFilter] = useState(false);
  const callbackRef = useRef<(() => void) | null>(null);
  const countRef = useRef(0);

  const setOpenCallback = useCallback((cb: (() => void) | null) => {
    callbackRef.current = cb;
  }, []);

  const setActiveFilterCount = useCallback((count: number) => {
    countRef.current = count;
  }, []);

  // Only changes when showFilter toggles — callback/count read from refs
  const value = useMemo(() => ({
    showFilter,
    onOpenFilters: callbackRef.current,
    activeFilterCount: countRef.current,
    setShowFilter,
    setOpenCallback,
    setActiveFilterCount,
  }), [showFilter, setShowFilter, setOpenCallback, setActiveFilterCount]);

  return (
    <FilterUIContext.Provider value={value}>
      {children}
    </FilterUIContext.Provider>
  );
};

export const useFilterUI = () => useContext(FilterUIContext);
