// src/pages/ComponentDetailPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchComponentById } from "../redux/componentSlice";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { RootState, AppDispatch } from "../redux/store";

import Button from "../components/Button";
import StarIcon from "../components/icons/StarIcon";
import SpinnerIcon from "../components/icons/SpinnerIcon";

interface ComponentDetailPageProps {
  id?: string;
}

const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();

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
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description"
  );

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
        component.metaTitle || `${component.name} | Комплектуючі`;

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

      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement("meta");
        keywordsTag.setAttribute("name", "keywords");
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute(
        "content",
        (component.keywords && component.keywords.join(", ")) ||
          `${component.name}, комплектуючі, запчастини`
      );

      const scriptId = "component-json-ld";
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
        name: component.name,
        image:
          component.images && component.images.length > 0
            ? component.images[0]
            : component.imageUrl,
        description: component.shortDescription || component.description,
        sku: component.sku || component.id,
        mpn: component.id,
        brand: component.brand
          ? { "@type": "Brand", name: component.brand }
          : undefined,
        offers: {
          "@type": "Offer",
          url: window.location.href,
          priceCurrency: component.currency || "UAH",
          price: component.price,
          priceValidUntil: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
          availability: component.inStock
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
  }, [component, status]);

  const handleAddToCart = useCallback(() => {
    if (component) {
      dispatch(addToCart(component));
    }
  }, [dispatch, component]);

  const handleToggleFavorite = useCallback(() => {
    if (component) {
      dispatch(toggleFavorite(component.id));
    }
  }, [dispatch, component]);

  if (!id) {
    return (
      <div className="text-center py-20 text-gray-500">
        Комплектуюча не знайдена. Не вказано ID.
      </div>
    );
  }

  if (status === "loading" || (!component && status === "idle")) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">
          Завантаження деталей комплектуючої...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20 text-red-600">
        <h1 className="text-3xl font-bold">Помилка завантаження</h1>
        <p className="text-slate-500 mt-3 mb-6">
          На жаль, сталася помилка при завантаженні інформації про комплектуючу:{" "}
          {error}
        </p>
        <Button variant="primary" onClick={() => navigate("/details")}>
          Повернутись до списку комплектуючих
        </Button>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-red-600">
          Комплектуючу не знайдено
        </h1>
        <p className="text-slate-500 mt-3 mb-6">
          На жаль, ми не змогли знайти комплектуючу за цим посиланням.
        </p>
        <Button variant="primary" onClick={() => navigate("/details")}>
          Повернутись до списку комплектуючих
        </Button>
      </div>
    );
  }

  const isFavoriteItem = favoriteIds.has(component.id);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={
                (component.images && component.images[activeImage]) ||
                component.imageUrl ||
                "https://via.placeholder.com/400"
              }
              alt={`${component.name} - Image ${activeImage + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
          {component.images && component.images.length > 1 && (
            <div className="flex gap-2">
              {component.images.map((img, index) => (
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
            {component.name}
          </h1>
          {component.brand && (
            <p className="text-lg text-slate-500 mb-4">
              {component.brand}
              {component.model ? ` - ${component.model}` : ""}
            </p>
          )}

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                component.inStock
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {component.inStock ? "В наявності" : "Немає в наявності"}
            </span>
          </div>

          <p className="text-4xl font-black text-slate-900 mb-6">
            {component.price?.toLocaleString("uk-UA") || "N/A"}{" "}
            {component.currency || "грн"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              type="button"
              onClick={handleAddToCart}
              variant="primary"
              className="flex-1"
              disabled={!component.inStock}
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
                  isFavoriteItem ? "text-orange-500" : "text-slate-500"
                }`}
              />
              <span>{isFavoriteItem ? "В обраному" : "В обране"}</span>
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
              dangerouslySetInnerHTML={{
                __html:
                  component.description ||
                  component.shortDescription ||
                  "<p>Опис відсутній.</p>",
              }}
            />
          )}
          {activeTab === "specifications" && (
            <div className="overflow-x-auto">
              {component.specifications &&
              component.specifications.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {component.specifications.map((spec, index) => (
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
              ) : (
                <p className="text-slate-500">Характеристики відсутні.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentDetailPage;
