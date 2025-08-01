import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../types";
import ProductList from "../components/TrailerList";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";
import Filters from "../components/Filters";
import FilterIcon from "../components/icons/FilterIcon";
import XMarkIcon from "../components/icons/XMarkIcon";
import Button from "../components/Button";
import SpinnerIcon from "../components/icons/SpinnerIcon";

import { fetchTrailers } from "../redux/trailerSlice";
import { fetchComponents } from "../redux/componentSlice";

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

  const {
    list: components,
    status: componentsStatus,
    error: componentsError,
  } = useSelector((state: RootState) => state.components);

  useEffect(() => {
    if (trailersStatus === "idle") {
      dispatch(fetchTrailers());
    }
    if (componentsStatus === "idle") {
      dispatch(fetchComponents());
    }
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
    if (Array.isArray(trailers)) {
      trailers.forEach((product) => {
        brands.add(product.brand);
        const suspensionSpec = product.specifications.find(
          (spec) => spec.name === "Тип підвіски"
        );
        if (suspensionSpec) {
          suspensionTypes.add(suspensionSpec.value);
        }
      });
    }
    return {
      allBrands: Array.from(brands).sort(),
      allSuspensionTypes: Array.from(suspensionTypes).sort(),
    };
  }, [trailers]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(trailers)) {
      return [];
    }

    return trailers.filter((product) => {
      const {
        searchQuery,
        minPrice,
        maxPrice,
        brands,
        inStockOnly,
        suspensionTypes,
      } = filters;

      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (minPrice && product.price < parseFloat(minPrice)) return false;
      if (maxPrice && product.price > parseFloat(maxPrice)) return false;
      if (brands.length > 0 && !brands.includes(product.brand)) return false;
      if (inStockOnly && !product.inStock) return false;
      if (suspensionTypes.length > 0) {
        const suspensionSpec = product.specifications.find(
          (spec) => spec.name === "Тип підвіски"
        );
        if (
          !suspensionSpec ||
          !suspensionTypes.includes(suspensionSpec.value)
        ) {
          return false;
        }
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
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch]
  );

  const isLoading = trailersStatus === "loading";
  const hasError = trailersStatus === "failed" && trailersError;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 tracking-tight">
          Знайди ідеальний причіп
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Використовуй фільтри, щоб обрати найкращий варіант для твоїх потреб.
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

        <aside className="hidden lg:block w-1/4 xl:w-1/5">
          <div className="sticky top-28">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              allBrands={allBrands}
              allSuspensionTypes={allSuspensionTypes}
            />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
          )}
          {hasError && (
            <div className="text-center py-20 text-red-600">
              Помилка завантаження причепів: {trailersError}
            </div>
          )}
          {!isLoading && !hasError && filteredProducts.length > 0 && (
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favoriteIds={favoriteIds}
            />
          )}
          {!isLoading && !hasError && filteredProducts.length === 0 && (
            <div className="text-center py-20 px-6 bg-white rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Причепів не знайдено
              </h2>
              <p className="text-gray-500 mt-3 mb-6">
                Спробуйте змінити критерії пошуку або скинути фільтри.
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

export default HomePage;
