import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchTrailerBySlug } from "../redux/trailerSlice";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  Package,
  Shield,
} from "lucide-react";
import { useToast } from "../components/Toast";
import TrailerLoading from "../components/TrailerLoading";
import { setMeta, setJsonLd, removeJsonLd, productSchema, breadcrumbSchema, SITE_URL } from "../utils/seo";

interface ProductDetailPageProps {
  slug: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const dispatch: AppDispatch = useDispatch();
  const { success, info } = useToast();

  const {
    list: trailers,
    currentProduct,
    status: listStatus,
    detailStatus,
    error: productError,
  } = useSelector((state: RootState) => state.trailers);

  // Find from pre-loaded list first, fall back to API-fetched product
  const product = useMemo(() => {
    const fromList = trailers.find((t) => t.slug === slug);
    if (fromList) return fromList;
    return currentProduct;
  }, [trailers, slug, currentProduct]);

  const isLoading = useMemo(() => {
    if (product) return false;
    if (detailStatus === "loading") return true;
    if (detailStatus === "idle" && listStatus === "loading") return true;
    return false;
  }, [product, detailStatus, listStatus]);

  const isFailed = detailStatus === "failed" && !product;

  const favoriteIdsArray = useSelector(
    (state: RootState) => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const [activeImage, setActiveImage] = useState(0);
  const prevSlugRef = useRef<string | undefined>(slug);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  }, []);

  // Fetch trailer: use local list first, fall back to API by slug
  useEffect(() => {
    if (slug !== prevSlugRef.current) {
      prevSlugRef.current = slug;
      setActiveImage(0);
    }

    if (!slug) return;

    const alreadyHave = product || currentProduct;
    if (!alreadyHave && detailStatus !== "loading") {
      dispatch(fetchTrailerBySlug(slug));
    }
  }, [slug, dispatch, product, currentProduct, detailStatus]);

  // SEO metadata
  useEffect(() => {
    if (product) {
      const title = product.metaTitle || `${product.name} | ПричепМаркет`;
      const desc = product.metaDescription || product.shortDescription || `${product.name} — купити в ПричепМаркет`;
      const canonical = `${SITE_URL}/product/${product.slug}`;
      const ogImage = product.images?.[0] || "";

      setMeta({ title, description: desc, canonical, ogImage: ogImage || undefined });

      // Product JSON-LD
      setJsonLd(
        productSchema({
          name: product.name,
          image: product.images?.[0] || "",
          description: desc,
          brand: product.brand,
          sku: product.sku,
          price: product.price,
          currency: product.currency,
          inStock: product.inStock,
          slug: product.slug,
        }),
        "product-schema"
      );

      // Breadcrumb JSON-LD
      setJsonLd(
        breadcrumbSchema([
          { name: "Головна", item: SITE_URL },
          { name: "Причепи", item: `${SITE_URL}/` },
          { name: product.name },
        ]),
        "breadcrumb-schema"
      );
    }

    return () => {
      removeJsonLd("product-schema");
      removeJsonLd("breadcrumb-schema");
    };
  }, [product]);

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

  if (isLoading) {
    return <TrailerLoading label="Завантаження..." />;
  }

  if (isFailed || !product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-2">
          {isFailed ? "Помилка завантаження" : "Товар не знайдено"}
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
      <nav aria-label="Навігаційна стежка" className="mb-4">
        <ol className="flex items-center gap-1.5 text-xs">
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Головна
            </button>
          </li>
          <li className="text-[var(--color-text-tertiary)]">/</li>
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Причепи
            </button>
          </li>
          <li className="text-[var(--color-text-tertiary)]">/</li>
          <li className="text-[var(--color-text-secondary)]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

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
                fetchPriority="high"
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
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide mb-1">
              {product.brand}
              {product.model ? ` · ${product.model}` : ""}
            </p>

            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] leading-tight mb-3">
              {product.name}
            </h1>

            <div className="mb-4 flex items-center gap-2">
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
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-amber-500/90 px-2 py-1 rounded-full">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                  </svg>
                  Рекомендовано
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold text-[var(--color-text)]">
                {product.price?.toLocaleString("uk-UA")}
              </span>
              <span className="text-sm text-[var(--color-text-tertiary)] ml-1">
                {product.currency}
              </span>
            </div>

            {product.shortDescription && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            <div className="flex gap-2 mt-auto mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 text-sm font-medium py-2.5 px-4 rounded-lg transition-all ${
                  isOutOfStock
                    ? "bg-[var(--color-bg)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                    : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98] cursor-pointer"
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

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border)]">
              {[
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

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-4 md:p-6">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Характеристики</h2>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
