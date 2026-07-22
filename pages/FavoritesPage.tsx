import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import ProductList from "../components/TrailerList";
import { toggleFavorite } from "../redux/favoritesSlice";
import { addToCart } from "../redux/cartSlice";
import { Product } from "../types";
import { Heart, ArrowRight } from "lucide-react";
import { useToast } from "../components/Toast";
import TrailerLoading from "../components/TrailerLoading";
import { setMeta, SITE_URL } from "../utils/seo";

const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { success, info } = useToast();

  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const allTrailers = useSelector((state: RootState) => state.trailers.list);
  const trailersStatus = useSelector((state: RootState) => state.trailers.status);
  const allComponents = useSelector(
    (state: RootState) => state.components.list
  );
  const componentsStatus = useSelector((state: RootState) => state.components.status);

  const allProducts = useMemo(() => {
    const trailers = Array.isArray(allTrailers) ? allTrailers : [];
    const components = Array.isArray(allComponents) ? allComponents : [];
    return [...trailers, ...components];
  }, [allTrailers, allComponents]);

  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const favoriteProducts = useMemo(
    () => allProducts.filter((product) => favoriteIds.has(product.id)),
    [allProducts, favoriteIds]
  );

  const isLoading =
    (trailersStatus === "loading" && allTrailers.length === 0) ||
    (componentsStatus === "loading" && allComponents.length === 0);

  useEffect(() => {
    const title = "Обране | ПричепМаркет";
    const desc = "Переглядайте та управляйте своєю колекцією обраних товарів: причепів та комплектуючих.";
    const canonical = `${SITE_URL}/favorites`;
    setMeta({ title, description: desc, canonical });
  }, []);

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
      info("Видалено з обраного");
    },
    [dispatch, info]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
      success("Додано в кошик", product.name);
    },
    [dispatch, success]
  );

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  if (isLoading) {
    return <TrailerLoading size="md" label="Завантаження..." />;
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg)] mb-4">
          <Heart className="h-7 w-7 text-[var(--color-text-tertiary)]" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-1">Список обраного порожній</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
          Додайте товари в обране, натиснувши на іконку серця
        </p>
        <a href="/" onClick={(e) => handleNav(e, "/")}>
          <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5">
            Переглянути каталог <ArrowRight className="h-4 w-4" />
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          Обране
          <span className="text-sm font-normal text-[var(--color-text-tertiary)] ml-2">
            ({favoriteProducts.length})
          </span>
        </h1>
      </div>
      <ProductList
        products={favoriteProducts}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        favoriteIds={favoriteIds}
      />
    </div>
  );
};

export default FavoritesPage;
