// src/components/admin/AdminProductForm.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  addTrailer,
  updateTrailer,
  fetchTrailerById,
} from "../../redux/trailerSlice";
import {
  addComponent,
  updateComponent,
  fetchComponentById,
} from "../../redux/componentSlice";
import { Product, Specification } from "../../types";
import { AppDispatch } from "../../redux/store";
import Button from "../Button";
import TrashIcon from "../icons/TrashIcon";
import SpinnerIcon from "../icons/SpinnerIcon";
import { useAuth } from "../../contexts/AuthContext";

interface AdminProductFormProps {
  productId?: string;
  productType: "Причепи" | "Комплектуючі";
}

const getInitialProductState = (
  productType: "Причепи" | "Комплектуючі"
): Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> => ({
  name: "",
  description: "",
  shortDescription: "",
  sku: "",
  brand: "",
  model: "",
  category: productType,
  subCategory: productType === "Причепи" ? "Легкові причепи" : "",
  type: productType === "Причепи" ? "trailer" : "spare_part",
  price: 0,
  currency: "UAH",
  inStock: true,
  quantity: 0,
  images: [""],
  specifications: [{ name: "", value: "", unit: "" }],
  compatibility: [],
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  isFeatured: false,
});

const AdminProductForm: React.FC<AdminProductFormProps> = ({
  productId,
  productType,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { setAuthMessage } = useAuth();

  const currentProductId = productId;

  const [product, setProduct] = useState<Omit<
    Product,
    "id" | "slug" | "createdAt" | "updatedAt"
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (currentProductId) {
        setLoading(true);
        setAuthMessage(null);
        try {
          let resultAction;
          if (productType === "Причепи") {
            resultAction = await dispatch(fetchTrailerById(currentProductId));
            if (fetchTrailerById.fulfilled.match(resultAction)) {
              setProduct({
                ...resultAction.payload,
                keywords: resultAction.payload.keywords || [],
                images:
                  resultAction.payload.images.length > 0
                    ? resultAction.payload.images
                    : [""],
                specifications:
                  resultAction.payload.specifications.length > 0
                    ? resultAction.payload.specifications
                    : [{ name: "", value: "", unit: "" }],
              });
            } else if (fetchTrailerById.rejected.match(resultAction)) {
              const errorMessage =
                (resultAction.payload as string) ||
                "Помилка завантаження причепа.";
              setAuthMessage({ type: "error", text: errorMessage });
            }
          } else {
            resultAction = await dispatch(fetchComponentById(currentProductId));
            if (fetchComponentById.fulfilled.match(resultAction)) {
              setProduct({
                ...resultAction.payload,
                keywords: resultAction.payload.keywords || [],
                images:
                  resultAction.payload.images.length > 0
                    ? resultAction.payload.images
                    : [""],
                specifications:
                  resultAction.payload.specifications.length > 0
                    ? resultAction.payload.specifications
                    : [{ name: "", value: "", unit: "" }],
              });
            } else if (fetchComponentById.rejected.match(resultAction)) {
              const errorMessage =
                (resultAction.payload as string) ||
                "Помилка завантаження комплектуючої.";
              setAuthMessage({ type: "error", text: errorMessage });
            }
          }
        } catch (e: any) {
          setAuthMessage({
            type: "error",
            text: e.message || "Не вдалося завантажити дані продукту.",
          });
          console.error("Failed to fetch product data:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setProduct(getInitialProductState(productType));
        setLoading(false);
      }
    };
    fetchProductData();
  }, [currentProductId, productType, dispatch, setAuthMessage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (!product) return;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setProduct((prev) => (prev ? { ...prev, [name]: checked } : null));
    } else {
      if (name === "price" || name === "quantity") {
        setProduct((prev) =>
          prev ? { ...prev, [name]: Number(value) } : null
        );
      } else {
        setProduct((prev) => (prev ? { ...prev, [name]: value } : null));
      }
    }
  };

  const handleSpecChange = (
    index: number,
    field: keyof Specification,
    value: string
  ) => {
    if (!product) return;
    const newSpecs = [...product.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setProduct((prev) => (prev ? { ...prev, specifications: newSpecs } : null));
  };

  const addSpec = () => {
    if (!product) return;
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            specifications: [
              ...prev.specifications,
              { name: "", value: "", unit: "" },
            ],
          }
        : null
    );
  };

  const removeSpec = (index: number) => {
    if (!product) return;
    const newSpecs = product.specifications.filter((_, i) => i !== index);
    setProduct((prev) => (prev ? { ...prev, specifications: newSpecs } : null));
  };

  const handleImageChange = (index: number, value: string) => {
    if (!product) return;
    const newImages = [...product.images];
    newImages[index] = value;
    setProduct((prev) => {
      console.log("Image state after change:", newImages);
      return prev ? { ...prev, images: newImages } : null;
    });
  };

  const addImage = () => {
    if (!product) return;
    setProduct((prev) => {
      const updatedImages = [...prev!.images, ""];
      console.log("Image state after adding new field:", updatedImages);
      return prev ? { ...prev, images: updatedImages } : null;
    });
  };

  const removeImage = (index: number) => {
    if (!product) return;
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct((prev) => {
      const finalImages = newImages.length > 0 ? newImages : [""];
      console.log("Image state after removing field:", finalImages);
      return prev
        ? {
            ...prev,
            images: finalImages,
          }
        : null;
    });
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!product) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(index, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setAuthMessage(null);

    const filteredSpecifications = product.specifications.filter(
      (spec) => spec.name.trim() !== "" && spec.value.trim() !== ""
    );

    const filteredImages = product.images.filter((img) => img.trim() !== "");

    const finalProductData = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      keywords: Array.isArray(product.keywords)
        ? product.keywords
        : (product.keywords as string).split(",").map((k: string) => k.trim()),
      images: filteredImages,
      specifications: filteredSpecifications,
    } as Product;

    console.log("Submitting product data:", finalProductData);
    console.log("Images being submitted:", finalProductData.images);

    try {
      if (currentProductId) {
        if (productType === "Причепи") {
          await dispatch(
            updateTrailer({
              id: currentProductId,
              updatedData: finalProductData,
            })
          ).unwrap();
        } else {
          await dispatch(
            updateComponent({
              id: currentProductId,
              updatedData: finalProductData,
            })
          ).unwrap();
        }
        setAuthMessage({
          type: "success",
          text: `${productType} успішно оновлено!`,
        });
      } else {
        const slug = finalProductData.name
          .toLowerCase()
          .replace(/[^a-z0-9-а-яієґї]/g, "-")
          .replace(/--+/g, "-")
          .replace(/^-+|-+$/g, "");
        const newProductData = {
          ...finalProductData,
          slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (productType === "Причепи") {
          await dispatch(addTrailer(newProductData)).unwrap();
        } else {
          await dispatch(addComponent(newProductData)).unwrap();
        }
        setAuthMessage({
          type: "success",
          text: `${productType} успішно додано!`,
        });
      }
      handleNavigation(
        productType === "Причепи" ? "/admin/products" : "/admin/accessories"
      );
    } catch (e: any) {
      console.error("Failed to save product:", e);
      const errorMessage = e.message || "Помилка при збереженні продукту.";
      setAuthMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">
          Завантаження даних товару...
        </p>
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
        <Button
          variant="primary"
          onClick={() =>
            handleNavigation(
              productType === "Причепи"
                ? "/admin/products"
                : "/admin/accessories"
            )
          }
        >
          Повернутися
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {currentProductId
          ? `Редагувати ${
              productType === "Причепи" ? "причіп" : "комплектуючу"
            }`
          : `Додати новий ${
              productType === "Причепи" ? "причіп" : "компонент"
            }`}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Назва
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Бренд
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Модель
            </label>
            <input
              type="text"
              name="model"
              value={product.model}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Категорія
            </label>
            <input
              type="text"
              name="category"
              value={product.category}
              readOnly
              className={`${inputClass} bg-gray-100`}
            />
          </div>
          {productType === "Причепи" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Підкатегорія
              </label>
              <select
                name="subCategory"
                value={product.subCategory}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Легкові причепи">Легкові причепи</option>
                <option value="Причепи для човнів">Причепи для човнів</option>
                <option value="Причепи для мототехніки">
                  Причепи для мототехніки
                </option>
                <option value="Причепи-платформи">Причепи-платформи</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ціна (UAH)
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={inputClass}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Кількість на складі
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className={inputClass}
              required
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Короткий опис
          </label>
          <textarea
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleChange}
            rows={2}
            className={inputClass}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Повний опис (HTML)
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={5}
            className={inputClass}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зображення
          </label>
          {product.images.map((img, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className={`${inputClass} flex-grow`}
                placeholder="Вставте URL або завантажте файл"
              />
              <label className="cursor-pointer whitespace-nowrap text-sm font-medium text-amber-600 hover:text-amber-500 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors">
                <span>Завантажити</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                />
              </label>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addImage}>
            Додати зображення
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Специфікації
          </label>
          {product.specifications.map((spec, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center"
            >
              <input
                type="text"
                placeholder="Назва"
                value={spec.name}
                onChange={(e) =>
                  handleSpecChange(index, "name", e.target.value)
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Значення"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Одиниця"
                value={spec.unit || ""}
                onChange={(e) =>
                  handleSpecChange(index, "unit", e.target.value)
                }
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 justify-self-start"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addSpec}>
            Додати специфікацію
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              value={product.metaTitle}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <input
              type="text"
              name="metaDescription"
              value={product.metaDescription}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ключові слова (через кому)
            </label>
            <input
              type="text"
              name="keywords"
              value={
                Array.isArray(product.keywords)
                  ? product.keywords.join(", ")
                  : product.keywords
              }
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-10">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />{" "}
              В наявності
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={product.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />{" "}
              Рекомендований
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              handleNavigation(
                productType === "Причепи"
                  ? "/admin/products"
                  : "/admin/accessories"
              )
            }
          >
            Скасувати
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {currentProductId ? "Оновити" : "Створити"}{" "}
            {productType === "Причепи" ? "причіп" : "компонент"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
