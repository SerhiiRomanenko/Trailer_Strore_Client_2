import React, { createContext, useContext, useCallback, useState } from "react";

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
  const [onOpenFilters, setOpenCallback] = useState<(() => void) | null>(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  return (
    <FilterUIContext.Provider
      value={{ showFilter, onOpenFilters, activeFilterCount, setShowFilter, setOpenCallback, setActiveFilterCount }}
    >
      {children}
    </FilterUIContext.Provider>
  );
};

export const useFilterUI = () => useContext(FilterUIContext);
