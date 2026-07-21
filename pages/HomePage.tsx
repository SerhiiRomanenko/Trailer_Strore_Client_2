import React, { useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../types";
import ProductList from "../components/TrailerList";
import TrailerLoading from "../components/TrailerLoading";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";
import Filters from "../components/Filters";
import { SlidersHorizontal } from "lucide-react";
import { useToast } from "../components/Toast";
import { useFilterUI } from "../contexts/FilterContext";
import { fetchTrailers } from "../redux/trailerSlice";

export interface FiltersState {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  inStockOnly: boolean;
  suspensionTypes: string[];
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, info } = useToast();
  const { setShowFilter, setOpenCallback, setActiveFilterCount } = useFilterUI();

  const {
    list: trailers,
    status: trailersStatus,
    error: trailersError,
  } = useSelector((state: RootState) => state.trailers);

  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    brands: [],
    inStockOnly: false,
    suspensionTypes: [],
  });

  // Ref to avoid stale closure in the toggle callback
  const setIsFiltersOpenRef = useRef(setIsFiltersOpen);
  setIsFiltersOpenRef.current = setIsFiltersOpen;

  // Fetch trailers data on mount (only if not already loaded)
  useEffect(() => {
    if (trailersStatus === "idle") dispatch(fetchTrailers());
  }, [trailersStatus, dispatch]);

  // Set page title
  useEffect(() => {
    document.title = "Причепи | ПричепМаркет";
  }, []);

  // Register filter state with global context for Header
  useEffect(() => {
    setShowFilter(true);
    setOpenCallback(() => setIsFiltersOpenRef.current(prev => !prev));
  }, [setShowFilter, setOpenCallback]);

  // Extract unique brands and suspension types from loaded data
  const { allBrands, allSuspensionTypes } = useMemo(() => {
    const brands = new Set<string>();
    const suspensionTypes = new Set<string>();
    if (!Array.isArray(trailers)) return { allBrands: [], allSuspensionTypes: [] };
    trailers.forEach((product) => {
      brands.add(product.brand);
      const suspensionSpec = product.specifications.find(
        (spec) => spec.name === "Тип підвіски"
      );
      if (suspensionSpec) suspensionTypes.add(suspensionSpec.value);
    });
    return {
      allBrands: Array.from(brands).sort(),
      allSuspensionTypes: Array.from(suspensionTypes).sort(),
    };
  }, [trailers]);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(trailers)) return [];
    return trailers.filter((product) => {
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        return false;
      if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (filters.inStockOnly && !product.inStock) return false;
      if (filters.suspensionTypes.length > 0) {
        const suspensionSpec = product.specifications.find(
          (spec) => spec.name === "Тип підвіски"
        );
        if (!suspensionSpec || !filters.suspensionTypes.includes(suspensionSpec.value))
          return false;
      }
      return true;
    });
  }, [filters, trailers]);

  const handleFilterChange = useCallback(
    (filterName: keyof FiltersState, value: any) => {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      minPrice: "",
      maxPrice: "",
      brands: [],
      inStockOnly: false,
      suspensionTypes: [],
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
      success("Додано в кошик", product.name);
    },
    [dispatch, success]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      const isFav = favoriteIds.has(productId);
      dispatch(toggleFavorite(productId));
      if (isFav) {
        info("Видалено з обраного");
      } else {
        success("Додано в обране");
      }
    },
    [dispatch, favoriteIds, success, info]
  );

  const hasFilters =
    filters.searchQuery ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.brands.length > 0 ||
    filters.inStockOnly ||
    filters.suspensionTypes.length > 0;

  const activeFilterCount =
    filters.brands.length +
    filters.suspensionTypes.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  // Sync active filter count with global context (ref-based, no re-render cascade)
  useEffect(() => {
    setActiveFilterCount(activeFilterCount);
  }, [activeFilterCount, setActiveFilterCount]);

  // --- Render logic ---
  // 1. Loading and no cached data: show skeletons
  const isLoading = trailersStatus === "loading" && trailers.length === 0;
  // 2. Failed and no data: show error
  const isFailed = trailersStatus === "failed" && trailers.length === 0;
  // 3. Have data and nothing loading: show products
  const hasProducts = trailersStatus !== "loading" && filteredProducts.length > 0;
  // 4. Have data but filters match nothing: show empty
  const isFilteredEmpty = trailersStatus !== "loading" && trailers.length > 0 && filteredProducts.length === 0;

  return (
    <div className="py-4 md:py-6">
      {/* Title */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          Причепи
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">
          {isLoading
            ? "Завантаження..."
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? "товар" : filteredProducts.length < 5 ? "товари" : "товарів"}`}
        </p>
      </div>

      {/* Layout: column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Mobile: inline collapsible filters — 100% width, first in DOM */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фільтри
              {hasFilters && (
                <span className="flex items-center justify-center h-5 w-5 bg-[var(--color-accent)] text-white rounded-full text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Скинути
              </button>
            )}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isFiltersOpen ? "max-h-[800px] mt-2" : "max-h-0"}`}>
            <div className="bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] p-3">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                allBrands={allBrands}
                allSuspensionTypes={allSuspensionTypes}
              />
            </div>
          </div>
        </div>

        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden md:block md:w-64 md:flex-shrink-0">
          <div className="sticky top-16">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allSuspensionTypes={allSuspensionTypes}
              hasActiveFilters={hasFilters}
            />
          </div>
        </aside>

        {/* Products — second in DOM, full width on mobile */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <TrailerLoading size="lg" label="Завантаження причепів..." />
          ) : isFailed ? (
            /* Failed: show error with retry button */
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Помилка: {trailersError || "Не вдалося завантажити дані"}
              </p>
              <button
                onClick={() => dispatch(fetchTrailers())}
                className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Спробувати знову
              </button>
            </div>
          ) : hasProducts ? (
            /* Products: show list */
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
            />
          ) : isFilteredEmpty ? (
            /* No results from filters: show hint */
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Нічого не знайдено за обраними фільтрами
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Скинути фільтри
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
