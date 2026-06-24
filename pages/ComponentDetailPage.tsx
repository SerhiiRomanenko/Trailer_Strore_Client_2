import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchComponentById } from "../redux/componentSlice";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { useToast } from "../components/Toast";

interface ComponentDetailPageProps {
  id?: string;
}

const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { success, info } = useToast();

  const {
    list: componentsList,
    status,
    error,
  } = useSelector((state: RootState) => state.components);

  const component = useMemo(
    () => componentsList.find((c) => c.id === id),
    [componentsList, id]
  );

  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const [activeImage, setActiveImage] = useState(0);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  }, []);

  useEffect(() => {
    if (
      id &&
      ((!component && status === "idle") ||
        (component && component.id !== id && status !== "loading"))
    ) {
      dispatch(fetchComponentById(id));
    }
  }, [id, component, status, dispatch]);

  useEffect(() => {
    if (status === "succeeded" && component) {
      document.title =
        component.metaTitle || `${component.name} | ПричепМаркет`;

      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute(
        "content",
        component.metaDescription ||
          component.shortDescription ||
          `Деталі комплектуючої ${component.name}.`
      );
    }
  }, [component, status]);

  const handleAddToCart = useCallback(() => {
    if (component) {
      dispatch(addToCart(component));
      success("Додано в кошик", component.name);
    }
  }, [dispatch, component, success]);

  const handleToggleFavorite = useCallback(() => {
    if (component) {
      const isCurrentlyFavorite = favoriteIds.has(component.id);
      dispatch(toggleFavorite(component.id));
      if (isCurrentlyFavorite) {
        info("Видалено з обраного");
      } else {
        success("Додано в обране");
      }
    }
  }, [dispatch, component, favoriteIds, success, info]);

  const navigateImage = useCallback(
    (direction: number) => {
      const images = imagesForComponent();
      if (images.length > 1) {
        setActiveImage(
          (prev) => (prev + direction + images.length) % images.length
        );
      }
    },
    [component]
  );

  const imagesForComponent = useCallback(() => {
    if (component?.images && component.images.length > 0) return component.images;
    if (component?.imageUrl) return [component.imageUrl];
    return [];
  }, [component]);

  const imagesToShow = imagesForComponent();

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-text-secondary)]">Комплектуюча не знайдена.</p>
      </div>
    );
  }

  if (status === "loading" || (!component && status === "idle")) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="h-5 w-5 text-[var(--color-primary)] animate-spin" />
        <span className="text-sm text-[var(--color-text-secondary)]">Завантаження...</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          Помилка завантаження
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">{error}</p>
        <button
          onClick={() => navigate("/details")}
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Назад до каталогу
        </button>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          Комплектуючу не знайдено
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
          На жаль, ми не змогли знайти комплектуючу за цим посиланням.
        </p>
        <button
          onClick={() => navigate("/details")}
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Назад до каталогу
        </button>
      </div>
    );
  }

  const isFavoriteItem = favoriteIds.has(component.id);
  const isOutOfStock = !component.inStock;

  return (
    <div className="py-4 md:py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/details")}
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
                src={imagesToShow[activeImage] || "https://via.placeholder.com/600x400/f5f5f7/999?text=--"}
                alt={component.name}
                className="w-full object-cover"
                style={{ aspectRatio: "4/3" }}
                loading="lazy"
              />
              {imagesToShow.length > 1 && (
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
            {imagesToShow.length > 1 && (
              <div className="flex gap-2 justify-center mt-3">
                {imagesToShow.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="p-4 md:p-6 flex flex-col">
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide mb-1">
              {component.brand}
              {component.model ? ` · ${component.model}` : ""}
            </p>

            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] leading-tight mb-3">
              {component.name}
            </h1>

            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  component.inStock
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    component.inStock ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {component.inStock ? "В наявності" : "Немає в наявності"}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold text-[var(--color-text)]">
                {component.price?.toLocaleString("uk-UA") || "N/A"}
              </span>
              <span className="text-sm text-[var(--color-text-tertiary)] ml-1">
                {component.currency || "грн"}
              </span>
            </div>

            {component.shortDescription && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                {component.shortDescription}
              </p>
            )}

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
                  isFavoriteItem
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                }`}
              >
                <Star className={`h-4 w-4 ${isFavoriteItem ? "fill-[var(--color-primary)]" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border)]">
              {[
                { icon: <Truck className="h-4 w-4" />, text: "Доставка" },
                // { icon: <Shield className="h-4 w-4" />, text: "Гарантія" },
                { icon: <Package className="h-4 w-4" />, text: "Якість" },
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

        {/* Specifications */}
        {component.specifications && component.specifications.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-4 md:p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Характеристики</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {component.specifications.map((spec, i) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDetailPage;
