import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

import { fetchTrailers, deleteTrailer } from "../../redux/trailerSlice";

import { fetchComponents, deleteComponent } from "../../redux/componentSlice";

import Button from "../Button";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";
import PlusIcon from "../icons/PlusIcon";
import SpinnerIcon from "../icons/SpinnerIcon";

type ProductType = "trailer" | "component";

const AdminProducts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ProductType>("trailer");

  const data = useSelector((state: RootState) =>
    activeTab === "trailer" ? state.trailers.list : state.components.list
  );
  const status = useSelector((state: RootState) =>
    activeTab === "trailer" ? state.trailers.status : state.components.status
  );
  const error = useSelector((state: RootState) =>
    activeTab === "trailer" ? state.trailers.error : state.components.error
  );

  const filteredProducts = data.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (activeTab === "trailer" && status === "idle") {
      dispatch(fetchTrailers());
    } else if (activeTab === "component" && status === "idle") {
      dispatch(fetchComponents());
    }
  }, [activeTab, status, dispatch]);

  const handleDelete = (productId: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
      if (activeTab === "trailer") {
        dispatch(deleteTrailer(productId));
      } else {
        dispatch(deleteComponent(productId));
      }
    }
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
          Керування товарами
        </h1>
        <Button
          onClick={(e) => handleNav(e, `/admin/${activeTab}/new`)}
          variant="primary"
          className="w-full md:w-auto flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>
            Додати {activeTab === "trailer" ? "причіп" : "комплектуючу"}
          </span>
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={`Пошук ${
            activeTab === "trailer" ? "причепа" : "комплектуючої"
          }...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {status === "loading" && (
        <div className="text-center py-8 text-gray-600">
          <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin mx-auto mb-4" />
          Завантаження...
        </div>
      )}
      {status === "failed" && (
        <p className="text-center py-8 text-red-600">Помилка: {error}</p>
      )}
      {status === "succeeded" && filteredProducts.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          Немає {activeTab === "trailer" ? "причепів" : "комплектуючих"}, які
          відповідають вашому пошуку.
        </p>
      )}

      {status === "succeeded" && filteredProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Таблиця для великих екранів */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Назва
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Бренд
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ціна
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Наявність
                  </th>
                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">{product.brand || "N/A"}</td>
                    <td className="px-6 py-4">
                      {product.price.toLocaleString("uk-UA")} {product.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.inStock
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "В наявності" : "Немає"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) =>
                            product.id &&
                            handleNav(
                              e,
                              `/admin/${activeTab}/edit/${product.id}`
                            )
                          }
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded-full"
                          aria-label="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id!)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                          aria-label="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-4">
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 text-lg">
                      {product.name}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.inStock
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "В наявності" : "Немає"}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    Бренд: {product.brand || "N/A"}
                  </div>
                  <div className="text-gray-900 font-bold text-base mb-3">
                    Ціна: {product.price.toLocaleString("uk-UA")}{" "}
                    {product.currency}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) =>
                        product.id &&
                        handleNav(e, `/admin/${activeTab}/edit/${product.id}`)
                      }
                      className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded-full"
                      aria-label="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                      aria-label="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
