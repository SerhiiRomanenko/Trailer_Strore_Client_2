import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchTrailerBySlug, clearCurrentProduct } from "../redux/trailerSlice";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  ArrowLeft,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { useToast } from "../components/Toast";

interface ProductDetailPageProps {
  slug: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const dispatch: AppDispatch = useDispatch();
  const { success, info } = useToast();

  const product = useSelector(
    (state: RootState) => state.trailers.currentProduct
  );
  const productStatus = useSelector(
    (state: RootState) => state.trailers.status
  );
  const productError = useSelector((state: RootState) => state.trailers.error);

  const favoriteIdsArray = useSelector(
    (state: RootState) => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  }, []);

  useEffect(() => {
    if (slug) dispatch(fetchTrailerBySlug(slug));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, slug]);

  // SEO metadata
  useEffect(() => {
    if (productStatus === "succeeded" && product) {
      document.title = product.metaTitle || `${product.name} | ПричепМаркет`;
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute("content", product.metaDescription);
    }
  }, [product, productStatus]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      dispatch(addToCart(product));
      success("Додано в кошик", product.name);
    }
  }, [dispatch, product, success]);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      const isFav = favoriteIds.has(product.id);
      dispatch(toggleFavorite(product.id));
      if (isFav) {
        info("Видалено з обраного");
      } else {
        success("Додано в обране");
      }
    }
  }, [dispatch, product, favoriteIds, success, info]);

  const navigateImage = useCallback(
    (direction: number) => {
      if (product && product.images.length > 1) {
        setActiveImage(
          (prev) =>
            (prev + direction + product.images.length) % product.images.length
        );
      }
    },
    [product]
  );

  if (productStatus === "loading") {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="h-5 w-5 text-[var(--color-primary)] animate-spin" />
        <span className="text-sm text-[var(--color-text-secondary)]">Завантаження...</span>
      </div>
    );
  }

  if (productStatus === "failed" || !product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          {productStatus === "failed" ? "Помилка завантаження" : "Товар не знайдено"}
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">{productError || "Спробуйте перейти на головну сторінку"}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> На головну
        </button>
      </div>
    );
  }

  const isFavorite = favoriteIds.has(product.id);
  const isOutOfStock = !product.inStock;

  return (
    <div className="py-4 md:py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Назад до каталогу
      </button>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image gallery */}
          <div className="p-4 md:p-6">
            <div className="relative overflow-hidden rounded-lg bg-[var(--color-bg)]">
              <img
                src={product.images[activeImage] || "https://via.placeholder.com/600x400/f5f5f7/999?text=--"}
                alt={product.name}
                className="w-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)] shadow-md transition-colors"
                    aria-label="Попереднє фото"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigateImage(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)] shadow-md transition-colors"
                    aria-label="Наступне фото"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-4 md:p-6 flex flex-col">
            {/* Brand */}
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide mb-1">
              {product.brand}
              {product.model ? ` · ${product.model}` : ""}
            </p>

            {/* Name */}
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Stock */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    product.inStock ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {product.inStock ? "В наявності" : "Немає в наявності"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-[var(--color-text)]">
                {product.price?.toLocaleString("uk-UA")}
              </span>
              <span className="text-sm text-[var(--color-text-tertiary)] ml-1">
                {product.currency}
              </span>
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-auto mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 text-sm font-medium py-2.5 px-4 rounded-lg transition-all ${
                  isOutOfStock
                    ? "bg-[var(--color-bg)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                    : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
                }`}
              >
                Додати в кошик
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-lg border border-[var(--color-border)] transition-colors ${
                  isFavorite
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                }`}
              >
                <Star className={`h-4 w-4 ${isFavorite ? "fill-[var(--color-primary)]" : ""}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
              {[
                { icon: <Truck className="h-4 w-4" />, text: "Доставка" },
                { icon: <Shield className="h-4 w-4" />, text: "Гарантія" },
                { icon: <Package className="h-4 w-4" />, text: "В наявності" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
                    {item.icon}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-[var(--color-border)]">
          <div className="flex">
            {(["description", "specifications"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab === "description" ? "Опис" : "Характеристики"}
              </button>
            ))}
          </div>
          <div className="p-4 md:p-6">
            {activeTab === "description" ? (
              <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="border-b border-[var(--color-border)] last:border-b-0">
                        <td className="py-2.5 pr-4 text-[var(--color-text-tertiary)] w-1/3 font-medium">
                          {spec.name}
                        </td>
                        <td className="py-2.5 text-[var(--color-text)] font-medium">
                          {spec.value}
                          {spec.unit ? ` ${spec.unit}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
