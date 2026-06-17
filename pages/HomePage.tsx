import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../types";
import ProductList from "../components/TrailerList";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";
import Filters from "../components/Filters";
import { Filter, X, SlidersHorizontal } from "lucide-react";
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
          <div className="sticky top-[60px]">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allSuspensionTypes={allSuspensionTypes}
            />
          </div>
        </aside>

        {/* Mobile filter button */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-4 py-2.5 rounded-full shadow-[var(--shadow-md)] text-[13px] font-semibold"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Фільтри
            {hasFilters && (
              <span className="flex items-center justify-center h-4 w-4 bg-white/30 rounded-full text-[10px]">
                {!filters.brands.length === 0 && !filters.suspensionTypes.length === 0 && !filters.inStockOnly && !filters.minPrice && !filters.maxPrice ? "" : (
                  filters.brands.length +
                  (filters.suspensionTypes.length > 0 ? 1 : 0) +
                  (filters.inStockOnly ? 1 : 0) +
                  (filters.minPrice ? 1 : 0) +
                  (filters.maxPrice ? 1 : 0)
                )}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter overlay */}
        <div
          className={`fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity ${
            isFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsFiltersOpen(false)}
        >
          <div
            className={`fixed top-0 left-0 h-full w-full max-w-xs bg-[var(--color-surface)] shadow-xl transition-transform duration-300 ${
              isFiltersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-sm font-semibold">Фільтри</h2>
              <button onClick={() => setIsFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 h-[calc(100vh-48px)] overflow-y-auto">
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

        {/* Products */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length > 0 ? (
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
            />
          ) : trailersStatus !== "loading" && trailersStatus !== "failed" ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
