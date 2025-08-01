// src/pages/ProductDetailPage.tsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { fetchTrailerBySlug, clearCurrentProduct } from "../redux/trailerSlice";
import Button from "../components/Button";
import StarIcon from "../components/icons/StarIcon";
import SpinnerIcon from "../components/icons/SpinnerIcon";

interface ProductDetailPageProps {
  slug: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const dispatch: AppDispatch = useDispatch();

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
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description"
  );

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  }, []);

  useEffect(() => {
    if (slug) {
      dispatch(fetchTrailerBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (productStatus === "succeeded" && product) {
      document.title = product.metaTitle;

      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", product.metaDescription);

      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement("meta");
        keywordsTag.setAttribute("name", "keywords");
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute("content", product.keywords.join(", "));

      const scriptId = "product-json-ld";
      let script = document.getElementById(
        scriptId
      ) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.images,
        description: product.shortDescription,
        sku: product.sku || product.model,
        mpn: product.id,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        offers: {
          "@type": "Offer",
          url: window.location.href,
          priceCurrency: product.currency,
          price: product.price,
          priceValidUntil: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      });

      return () => {
        const scriptToRemove = document.getElementById(scriptId);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [product, productStatus]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      dispatch(addToCart(product));
    }
  }, [dispatch, product]);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      dispatch(toggleFavorite(product.id));
    }
  }, [dispatch, product]);

  if (productStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">Завантаження товару...</p>
      </div>
    );
  }

  if (productStatus === "failed") {
    return (
      <div className="text-center py-20 text-red-600">
        <h1 className="text-3xl font-bold">Помилка завантаження</h1>
        <p className="text-slate-500 mt-3 mb-6">
          На жаль, сталася помилка при завантаженні інформації про товар:{" "}
          {productError}
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          На головну
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-red-600">Товар не знайдено</h1>
        <p className="text-slate-500 mt-3 mb-6">
          На жаль, ми не змогли знайти товар за цим посиланням.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          На головну
        </Button>
      </div>
    );
  }

  const isFavorite = favoriteIds.has(product.id);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={product.images[activeImage]}
              alt={`${product.name} - Image ${activeImage + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? "border-orange-500 shadow-md"
                      : "border-slate-200 hover:border-orange-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-slate-500 mb-4">
            {product.brand}
            {product.model ? ` - ${product.model}` : ""}
          </p>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                product.inStock
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "В наявності" : "Немає в наявності"}
            </span>
          </div>

          <p className="text-4xl font-black text-slate-900 mb-6">
            {product.price.toLocaleString("uk-UA")} {product.currency}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              type="button"
              onClick={handleAddToCart}
              variant="primary"
              className="flex-1"
              disabled={!product.inStock}
            >
              Додати в кошик
            </Button>
            <Button
              type="button"
              onClick={handleToggleFavorite}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <StarIcon
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? "text-orange-500" : "text-slate-500"
                }`}
              />
              <span>{isFavorite ? "В обраному" : "В обране"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 px-1 border-b-2 font-semibold text-lg transition-colors ${
                activeTab === "description"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Опис
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`py-4 px-1 border-b-2 font-semibold text-lg transition-colors ${
                activeTab === "specifications"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Характеристики
            </button>
          </nav>
        </div>
        <div className="py-6">
          {activeTab === "description" && (
            <div
              className="prose prose-lg max-w-none text-slate-600"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {activeTab === "specifications" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-200 last:border-b-0"
                    >
                      <td className="py-4 px-4 font-medium text-slate-500 bg-slate-50 w-1/3">
                        {spec.name}
                      </td>
                      <td className="py-4 px-4 text-slate-800 font-semibold">
                        {spec.value} {spec.unit}
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
  );
};

export default ProductDetailPage;
