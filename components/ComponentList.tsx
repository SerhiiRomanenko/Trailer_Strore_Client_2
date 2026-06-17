import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchComponents } from "../redux/componentSlice";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ComponentFilters, {
  ComponentFiltersState,
} from "../components/ComponentFilters";
import { SlidersHorizontal, X } from "lucide-react";
import { useToast } from "../components/Toast";

const SkeletonCard = () => (
  <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
    <div className="skeleton" style={{ aspectRatio: "1" }} />
    <div className="p-2.5 space-y-2">
      <div className="skeleton h-2.5 w-16" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-5 w-20" />
      <div className="skeleton h-8 w-full rounded-md" />
    </div>
  </div>
);

const ComponentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, info } = useToast();
  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const { list: components, status } = useSelector((state: RootState) => state.components);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ComponentFiltersState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    brands: [],
    componentTypes: [],
    inStockOnly: false,
  });

  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    components?.forEach((c) => { if (c.brand) brands.add(c.brand); });
    return Array.from(brands).sort();
  }, [components]);

  const allComponentTypes = useMemo(() => {
    const types = new Set<string>();
    components?.forEach((c) => { if (c.subCategory) types.add(c.subCategory); });
    return Array.from(types).sort();
  }, [components]);

  useEffect(() => {
    if (status === "idle") dispatch(fetchComponents());
  }, [dispatch, status]);

  const filteredComponents = useMemo(() => {
    if (!Array.isArray(components)) return [];
    return components.filter((component: Product) => {
      if (component.category !== "Комплектуючі") return false;
      if (filters.searchQuery && !component.name.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        return false;
      if (filters.minPrice && component.price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && component.price > parseFloat(filters.maxPrice)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(component.brand)) return false;
      if (filters.componentTypes.length > 0 && !filters.componentTypes.includes(component.subCategory || ""))
        return false;
      if (filters.inStockOnly && !component.inStock) return false;
      return true;
    });
  }, [components, filters]);

  const handleFilterChange = useCallback(
    (filterName: keyof ComponentFiltersState, value: any) => {
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
      componentTypes: [],
      inStockOnly: false,
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
    filters.componentTypes.length > 0 ||
    filters.inStockOnly;

  return (
    <div className="py-4 md:py-6">
      {/* Title */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          Комплектуючі
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mt-0.5">
          {filteredComponents.length} {filteredComponents.length === 1 ? "товар" : filteredComponents.length < 5 ? "товари" : "товарів"}
        </p>
      </div>

      <div className="flex gap-4">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-16">
            <ComponentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allComponentTypes={allComponentTypes}
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
                {filters.brands.length +
                  filters.componentTypes.length +
                  (filters.inStockOnly ? 1 : 0) +
                  (filters.minPrice ? 1 : 0) +
                  (filters.maxPrice ? 1 : 0)}
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
              <ComponentFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                allBrands={allBrands}
                allComponentTypes={allComponentTypes}
              />
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {status === "loading" && components.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : status === "failed" ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--color-error)]">Помилка завантаження</p>
              <button
                onClick={() => dispatch(fetchComponents())}
                className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Спробувати знову
              </button>
            </div>
          ) : filteredComponents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredComponents.map((component: Product) => (
                <ProductCard
                  key={component.id}
                  product={component}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favoriteIds.has(component.id)}
                />
              ))}
            </div>
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

export default ComponentList;
