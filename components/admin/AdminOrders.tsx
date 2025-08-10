import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  updateOrderStatus,
  OrderStatus,
  fetchAllOrders,
  deleteOrder,
} from "../../redux/ordersSlice";
import { useAuth } from "../../contexts/AuthContext";
import SpinnerIcon from "../icons/SpinnerIcon";
import TrashIcon from "../icons/TrashIcon";
import Button from "../Button";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { setAuthMessage } = useAuth();
  const { list: orders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders
  );
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, orderStatus]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      setAuthMessage({
        type: "success",
        text: `Статус замовлення ${orderId} оновлено на ${newStatus}`,
      });
      dispatch(fetchAllOrders());

      if (showDetailsModal && selectedOrderForModal?.id === orderId) {
        setSelectedOrderForModal((prev: any) => ({
          ...prev,
          status: newStatus,
        }));
      }
    } catch (error: any) {
      setAuthMessage({
        type: "error",
        text: `Помилка оновлення статусу: ${
          error.message || "Невідома помилка"
        }`,
      });
      console.error("Failed to update order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (
      window.confirm(
        "Ви впевнені, що хочете видалити це замовлення? Цю дію не можна скасувати."
      )
    ) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        setAuthMessage({
          type: "success",
          text: `Замовлення ${orderId} успішно видалено!`,
        });
        dispatch(fetchAllOrders());
      } catch (error: any) {
        setAuthMessage({
          type: "error",
          text: `Помилка видалення замовлення: ${
            error.message || "Невідома помилка"
          }`,
        });
        console.error("Failed to delete order:", error);
      }
    }
  };

  const filteredOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    return sorted.filter(
      (order) => filterStatus === "All" || order.status === filterStatus
    );
  }, [orders, filterStatus]);

  const statuses: OrderStatus[] = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const openOrderDetailsModal = async (orderId: string) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedOrderForModal(null);
    setShowDetailsModal(true);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setModalError(
        "Токен авторизації відсутній. Будь ласка, увійдіть як адміністратор."
      );
      setModalLoading(false);
      return;
    }

    try {
      console.log(`Fetching details for order ID: ${orderId}`);
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Помилка HTTP: ${response.status}`
        );
      }

      const data = await response.json();
      setSelectedOrderForModal(data);
      console.log("Order details fetched for modal:", data);
    } catch (error: any) {
      setModalError(
        `Помилка завантаження деталей замовлення: ${error.message}`
      );
      console.error("Failed to fetch order details for modal:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const closeOrderDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrderForModal(null);
    setModalError(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 md:mb-8 text-center">
        Керування замовленнями
      </h1>

      <div className="mb-4 md:mb-6 bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
        <label
          htmlFor="status-filter"
          className="block text-base md:text-lg font-medium text-gray-700 mb-2"
        >
          Фільтрувати за статусом:
        </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as OrderStatus | "All")
          }
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                     focus:outline-none focus:ring-3 focus:ring-amber-500 focus:border-amber-500
                     transition-all duration-200 ease-in-out text-sm md:text-base text-gray-800 bg-white hover:border-amber-400"
        >
          <option value="All">Всі</option>
          {statuses.map((status) => (
            <option key={status} value={status} className="text-gray-800">
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  ID Замовлення
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  Дата
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  Клієнт
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  Сума
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  Статус
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold text-gray-800"
                >
                  Дії
                </th>
              </tr>
            </thead>
            <tbody>
              {orderStatus === "loading" && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-10 text-lg text-gray-600"
                  >
                    <SpinnerIcon className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-2" />
                    Завантаження замовлень...
                  </td>
                </tr>
              )}
              {orderStatus !== "loading" && filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-10 text-lg text-gray-600"
                  >
                    Замовлень не знайдено.
                  </td>
                </tr>
              )}
              {orderStatus !== "loading" &&
                filteredOrders.map((order) => (
                  <tr
                    key={order.id || `order-${Math.random()}`}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td
                      className="px-6 py-4 font-medium text-gray-900 cursor-pointer hover:underline text-blue-600"
                      onClick={() => openOrderDetailsModal(order.id)}
                    >
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      {order.date
                        ? new Date(order.date).toLocaleString("uk-UA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.customer?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {order.total !== undefined && order.total !== null
                        ? `${order.total.toLocaleString("uk-UA")} грн`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className={`p-2 text-sm font-semibold rounded-lg border-2 cursor-pointer
                                   focus:outline-none focus:ring-2 focus:ring-offset-2
                                   transition-all duration-200 ease-in-out
                                   ${
                                     order.status === "Delivered"
                                       ? "bg-emerald-100 border-emerald-300 text-emerald-800 focus:ring-emerald-500"
                                       : ""
                                   }
                                   ${
                                     order.status === "Shipped"
                                       ? "bg-blue-100 border-blue-300 text-blue-800 focus:ring-blue-500"
                                       : ""
                                   }
                                   ${
                                     order.status === "Processing"
                                       ? "bg-amber-100 border-amber-300 text-amber-800 focus:ring-amber-500"
                                       : ""
                                   }
                                   ${
                                     order.status === "Cancelled"
                                       ? "bg-red-100 border-red-300 text-red-800 focus:ring-red-500"
                                       : ""
                                   }
                                  `}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === "Delivered" && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                          aria-label="Видалити замовлення"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4">
          {orderStatus === "loading" && (
            <div className="text-center py-8 text-lg text-gray-600">
              <SpinnerIcon className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-2" />
              Завантаження замовлень...
            </div>
          )}
          {orderStatus !== "loading" && filteredOrders.length === 0 && (
            <div className="text-center py-8 text-lg text-gray-600">
              Замовлень не знайдено.
            </div>
          )}
          {orderStatus !== "loading" &&
            filteredOrders.map((order) => (
              <div
                key={order.id || `order-mobile-${Math.random()}`}
                className="bg-white border-b last:border-b-0 p-4 mb-3 rounded-lg shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <div
                      className="font-bold text-gray-900 cursor-pointer hover:underline text-blue-600 text-base"
                      onClick={() => openOrderDetailsModal(order.id)}
                    >
                      ID: {order.id}
                    </div>
                    <div className="text-sm text-gray-600">
                      Дата:{" "}
                      {order.date
                        ? new Date(order.date).toLocaleString("uk-UA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-700">
                      Клієнт: {order.customer?.name || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end sm:items-start">
                    <div className="font-semibold text-gray-800 text-lg">
                      {order.total !== undefined && order.total !== null
                        ? `${order.total.toLocaleString("uk-UA")} грн`
                        : "N/A"}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className={`mt-1 p-2 text-sm font-semibold rounded-lg border-2 cursor-pointer
                                 focus:outline-none focus:ring-2 focus:ring-offset-2
                                 transition-all duration-200 ease-in-out
                                 ${
                                   order.status === "Delivered"
                                     ? "bg-emerald-100 border-emerald-300 text-emerald-800 focus:ring-emerald-500"
                                     : ""
                                 }
                                 ${
                                   order.status === "Shipped"
                                     ? "bg-blue-100 border-blue-300 text-blue-800 focus:ring-blue-500"
                                     : ""
                                 }
                                 ${
                                   order.status === "Processing"
                                     ? "bg-amber-100 border-amber-300 text-amber-800 focus:ring-amber-500"
                                     : ""
                                 }
                                 ${
                                   order.status === "Cancelled"
                                     ? "bg-red-100 border-red-300 text-red-800 focus:ring-red-500"
                                     : ""
                                 }
                                `}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {order.status === "Delivered" && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                      aria-label="Видалити замовлення"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 relative border border-gray-200 max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center">
              Деталі замовлення
            </h2>
            {modalLoading && (
              <div className="flex justify-center items-center py-8">
                <SpinnerIcon className="h-8 w-8 text-amber-500 animate-spin" />
                <p className="ml-3 text-lg text-slate-700">
                  Завантаження деталей...
                </p>
              </div>
            )}
            {modalError && (
              <div className="text-red-600 py-4 text-center">
                <p>Помилка: {modalError}</p>
              </div>
            )}
            {selectedOrderForModal && !modalLoading && !modalError && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg text-gray-700 text-sm mb-4">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold w-1/4">
                        ID Замовлення:
                      </td>
                      <td className="px-3 py-1.5 break-words">
                        {selectedOrderForModal.id}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Дата:</td>
                      <td
                        className="px-3 py-1.5"
                        dangerouslySetInnerHTML={{
                          __html: selectedOrderForModal.date
                            ? `${new Date(
                                selectedOrderForModal.date
                              ).toLocaleDateString("uk-UA", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                              })}, <strong>Час:</strong> ${new Date(
                                selectedOrderForModal.date
                              ).toLocaleTimeString("uk-UA", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : "N/A",
                        }}
                      />
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Клієнт:</td>
                      <td className="px-3 py-1.5">
                        {selectedOrderForModal.customer?.name || "N/A"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Телефон:</td>
                      <td className="px-3 py-1.5">
                        <a
                          href={`tel:${selectedOrderForModal.customer?.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedOrderForModal.customer?.phone || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Пошта:</td>
                      <td className="px-3 py-1.5">
                        <a
                          href={`mailto:${selectedOrderForModal.customer?.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedOrderForModal.customer?.email || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Доставка:</td>
                      <td className="px-3 py-1.5">
                        {selectedOrderForModal.delivery?.method === "pickup"
                          ? "Самовивіз"
                          : `Нова Пошта - ${
                              selectedOrderForModal.delivery?.cityName || "N/A"
                            }, ${
                              selectedOrderForModal.delivery?.branchName ||
                              "N/A"
                            }`}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Оплата:</td>
                      <td className="px-3 py-1.5">
                        {selectedOrderForModal.payment?.method === "cash"
                          ? "Готівка"
                          : "Картка"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-semibold">Статус:</td>
                      <td className="px-3 py-1.5">
                        <select
                          value={selectedOrderForModal.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedOrderForModal.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`p-2 text-sm font-semibold rounded-lg border-2 cursor-pointer
                                     focus:outline-none focus:ring-2 focus:ring-offset-2
                                     transition-all duration-200 ease-in-out
                                     ${
                                       selectedOrderForModal.status ===
                                       "Delivered"
                                         ? "bg-emerald-100 border-emerald-300 text-emerald-800 focus:ring-emerald-500"
                                         : ""
                                     }
                                     ${
                                       selectedOrderForModal.status ===
                                       "Shipped"
                                         ? "bg-blue-100 border-blue-300 text-blue-800 focus:ring-blue-500"
                                         : ""
                                     }
                                     ${
                                       selectedOrderForModal.status ===
                                       "Processing"
                                         ? "bg-amber-100 border-amber-300 text-amber-800 focus:ring-amber-500"
                                         : ""
                                     }
                                     ${
                                       selectedOrderForModal.status ===
                                       "Cancelled"
                                         ? "bg-red-100 border-red-300 text-red-800 focus:ring-red-500"
                                         : ""
                                     }
                                    `}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h3 className="text-base md:text-xl font-bold text-gray-800 mt-3 mb-1">
                  Товари в замовленні:
                </h3>
                {selectedOrderForModal?.items &&
                selectedOrderForModal.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <th className="px-3 py-1.5 border-b-2 border-gray-200">
                            Товар
                          </th>
                          <th className="px-3 py-1.5 border-b-2 border-gray-200 text-center">
                            Кількість
                          </th>
                          <th className="px-3 py-1.5 border-b-2 border-gray-200 text-right">
                            Ціна за одиницю
                          </th>
                          <th className="px-3 py-1.5 border-b-2 border-gray-200 text-right">
                            Всього
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderForModal.items.map((item: any) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 last:border-b-0"
                          >
                            <td className="px-3 py-1.5 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.images && item.images.length > 0 && (
                                  <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded-md mr-2"
                                  />
                                )}
                                <span className="text-gray-900 font-medium">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-1.5 whitespace-nowrap text-center text-gray-700">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-1.5 whitespace-nowrap text-right text-gray-700">
                              {item.price?.toLocaleString("uk-UA")}{" "}
                              {item.currency}
                            </td>
                            <td className="px-3 py-1.5 whitespace-nowrap text-right text-gray-900 font-semibold">
                              {(item.price * item.quantity).toLocaleString(
                                "uk-UA"
                              )}{" "}
                              {item.currency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 border-t-2 border-gray-200 text-right">
                          <th
                            colSpan={3}
                            className="px-3 py-1.5 text-base font-semibold text-gray-800"
                          >
                            Загальна сума:
                          </th>
                          <td className="px-3 py-1.5 text-base font-bold text-gray-900">
                            {selectedOrderForModal.total?.toLocaleString(
                              "uk-UA"
                            )}{" "}
                            грн
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Немає товарів у цьому замовленні.
                  </p>
                )}
                <div className="mt-4 flex justify-end">
                  <Button onClick={closeOrderDetailsModal} variant="secondary">
                    Закрити
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
