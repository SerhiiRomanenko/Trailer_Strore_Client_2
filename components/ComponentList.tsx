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
    components.forEach((component) => {
      if (component.brand) brands.add(component.brand);
    });
    return Array.from(brands).sort();
  }, [components]);

  const allComponentTypes = useMemo(() => {
    const types = new Set<string>();
    components.forEach((component) => {
      if (component.subCategory) types.add(component.subCategory);
    });
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
    },
    [dispatch]
  );

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-500">
        Завантаження комплектуючих...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20 text-red-500">
        Помилка завантаження комплектуючих: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Комплектуючі
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
          Все необхідне для ремонту та модернізації вашого причепа.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ComponentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            allBrands={allBrands}
            allComponentTypes={allComponentTypes}
          />
        </div>

        <div className="md:col-span-3">
          {filteredComponents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {" "}
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
            <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                Комплектуючих не знайдено
              </h2>
              <p className="text-slate-500 mt-3 mb-6">
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
