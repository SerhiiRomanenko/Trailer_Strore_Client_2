import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchComponents } from "../redux/componentSlice";
import { Product } from "../types";
import ProductCard from "./ProductCard";
import TrailerLoading from "./TrailerLoading";
import ComponentFilters, {
  ComponentFiltersState,
} from "./ComponentFilters";
import { SlidersHorizontal } from "lucide-react";
import { useToast } from "./Toast";
import { setMeta, SITE_URL } from "../utils/seo";

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
    inStockOnly: true,
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
    const title = "Комплектуючі для причепів | ПричепМаркет";
    const desc = "Каталог комплектуючих для причепів: вузли, гальма, підвіски, електрика, аксесуари та інше.";
    const canonical = `${SITE_URL}/components`;
    setMeta({ title, description: desc, canonical });
  }, []);

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

  const activeFilterCount =
    filters.brands.length +
    filters.componentTypes.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

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

        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden md:block md:w-64 md:flex-shrink-0">
          <div className="sticky top-16">
            <ComponentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allComponentTypes={allComponentTypes}
              hasActiveFilters={hasFilters}
            />
          </div>
        </aside>

        {/* Product grid — second in DOM, full width on mobile */}
        <div className="flex-1 min-w-0">
          {status === "loading" && components.length === 0 ? (
            <TrailerLoading size="lg" label="Завантаження комплектуючих..." />
          ) : status === "failed" && components.length === 0 ? (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
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
