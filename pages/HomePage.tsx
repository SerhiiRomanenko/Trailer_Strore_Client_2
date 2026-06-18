import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../types";
import ProductList from "../components/TrailerList";
import SkeletonCard from "../components/SkeletonCard";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";
import Filters from "../components/Filters";
import { X, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { fetchTrailers } from "../redux/trailerSlice";
import { fetchComponents } from "../redux/componentSlice";
import { useToast } from "../components/Toast";

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

  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const {
    list: trailers,
    status: trailersStatus,
    error: trailersError,
  } = useSelector((state: RootState) => state.trailers);

  const { status: componentsStatus } = useSelector((state: RootState) => state.components);

  useEffect(() => {
    document.title = "Причепи | ПричепМаркет";
  }, []);

  useEffect(() => {
    if (trailersStatus === "idle") dispatch(fetchTrailers());
    if (componentsStatus === "idle") dispatch(fetchComponents());
  }, [trailersStatus, componentsStatus, dispatch]);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    brands: [],
    inStockOnly: false,
    suspensionTypes: [],
  });

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

  return (
    <div className="py-4 md:py-6">
      {/* Title */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          Причепи
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">
          {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : filteredProducts.length < 5 ? "товари" : "товарів"}
        </p>
      </div>

      <div className="flex gap-4">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-16">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allSuspensionTypes={allSuspensionTypes}
            />
          </div>
        </aside>

        {/* Mobile filter chips */}
        <div className="lg:hidden mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className={`flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                hasFilters
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Фільтри
              {hasFilters && (
                <span className="flex items-center justify-center h-4 w-4 bg-white/30 rounded-full text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {filters.inStockOnly && (
              <button
                onClick={() => handleFilterChange("inStockOnly", false)}
                className="flex items-center gap-1 flex-shrink-0 px-3 py-2 rounded-full text-[13px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
              >
                В наявності <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile bottom sheet filter */}
        {isFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 animate-fade-in"
              onClick={() => setIsFiltersOpen(false)}
            />
            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
              {/* Handle */}
              <div className="flex items-center justify-center py-3 border-b border-[var(--color-border)]">
                <div className="w-8 h-1 bg-[var(--color-border)] rounded-full" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <h2 className="text-sm font-semibold text-[var(--color-text)]">Фільтри</h2>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-1 rounded-lg hover:bg-[var(--color-surface-hover)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Filters */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <Filters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  allBrands={allBrands}
                  allSuspensionTypes={allSuspensionTypes}
                />
              </div>
              {/* Apply button */}
              <div className="px-4 py-3 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  {hasFilters ? `Показати ${filteredProducts.length}` : "Застосувати"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          {trailersStatus === "loading" && trailers.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : trailersStatus === "failed" && trailers.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-error)]">Помилка: {trailersError}</p>
              <button
                onClick={() => dispatch(fetchTrailers())}
                className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Спробувати знову
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
            />
          ) : (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-tertiary)]">Нічого не знайдено</p>
              {hasFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                >
                  Скинути фільтри
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
