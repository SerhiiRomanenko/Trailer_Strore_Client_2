// src/pages/ComponentList.tsx
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchComponents } from "../redux/componentSlice";
import { Product } from "../types";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import ComponentFilters, {
  ComponentFiltersState,
} from "../components/ComponentFilters";
import FilterIcon from "../components/icons/FilterIcon";
import XMarkIcon from "../components/icons/XMarkIcon";

const ComponentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const {
    list: components,
    status,
    error,
  } = useSelector((state: RootState) => state.components);

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
    if (Array.isArray(components)) {
      components.forEach((component) => {
        if (component.brand) brands.add(component.brand);
      });
    }
    return Array.from(brands).sort();
  }, [components]);

  const allComponentTypes = useMemo(() => {
    const types = new Set<string>();
    if (Array.isArray(components)) {
      components.forEach((component) => {
        if (component.subCategory) types.add(component.subCategory);
      });
    }
    return Array.from(types).sort();
  }, [components]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchComponents());
    }
    document.title = "Комплектуючі для причепів | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Великий вибір комплектуючих для легкових причепів: електрика, колеса, осі, ресори та багато іншого. Купуйте онлайн з доставкою по Україні."
      );
    }
  }, [dispatch, status]);

  const filteredComponents = useMemo(() => {
    if (!Array.isArray(components)) {
      return [];
    }

    return components.filter((component: Product) => {
      if (component.category !== "Комплектуючі") {
        return false;
      }

      if (
        filters.searchQuery &&
        !component.name
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      const price = component.price;
      if (filters.minPrice && price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) {
        return false;
      }

      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(component.brand)
      ) {
        return false;
      }

      if (
        filters.componentTypes.length > 0 &&
        !filters.componentTypes.includes(component.subCategory || "")
      ) {
        return false;
      }

      if (filters.inStockOnly && !component.inStock) {
        return false;
      }

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
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
      if (favoriteIds.has(productId)) {
        alert("Комплектуюча видалена з обраного");
      } else {
        alert("Комплектуюча додана в обране");
      }
    },
    [dispatch, favoriteIds]
  );

  const isLoading = status === "loading";
  const hasError = status === "failed" && error;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          Комплектуючі
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Все необхідне для ремонту та модернізації вашого причепа.
        </p>
      </div>

      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="flex items-center gap-2 w-full justify-center bg-white p-3 rounded-lg shadow font-semibold border border-gray-200"
        >
          <FilterIcon className="h-5 w-5" />
          <span>Фільтри</span>
        </button>
      </div>

      <div className="flex gap-8">
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity lg:hidden ${
            isFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsFiltersOpen(false)}
        >
          <div
            className={`fixed top-0 left-0 h-full w-full max-w-xs bg-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out ${
              isFiltersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold">Фільтри</h2>
              <button onClick={() => setIsFiltersOpen(false)} className="p-1">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 h-[calc(100vh-65px)] overflow-y-auto">
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

        <aside className="hidden lg:block w-1/4 xl:w-1/5">
          <div className="sticky top-28">
            <ComponentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allComponentTypes={allComponentTypes}
            />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <svg
                className="h-10 w-10 text-amber-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
          {hasError && (
            <div className="text-center py-20 text-red-600">
              Помилка завантаження комплектуючих: {error}
            </div>
          )}
          {!isLoading && !hasError && filteredComponents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
          )}
          {!isLoading && !hasError && filteredComponents.length === 0 && (
            <div className="text-center py-20 px-6 bg-white rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Комплектуючих не знайдено
              </h2>
              <p className="text-gray-500 mt-3 mb-6">
                Спробуйте змінити критерії фільтрації або скинути їх.
              </p>
              <Button onClick={handleResetFilters} variant="primary">
                Скинути фільтри
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentList;
