import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import {
  fetchMyOrders,
  fetchOrderById,
  clearCurrentOrder,
  OrderStatus,
  updateOrderStatus,
} from "../redux/ordersSlice";
import SpinnerIcon from "../components/icons/SpinnerIcon";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const MyOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading: authLoading, setAuthMessage } = useAuth();
  const {
    list: userOrders,
    status: orderStatus,
    error,
    currentOrder,
  } = useSelector((state: RootState) => state.orders);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (currentUser && orderStatus === "idle") {
      dispatch(fetchMyOrders());
    }
  }, [currentUser, dispatch, orderStatus]);

  const sortedUserOrders = useMemo(() => {
    return [...userOrders].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [userOrders]);

  if (authLoading || orderStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />{" "}
        {/* Додано animate-spin */}
        <p className="ml-3 text-lg text-slate-700">Завантаження замовлень...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const statusClasses = {
    Processing: "bg-amber-100 text-amber-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const openOrderDetailsModal = async (orderId: string) => {
    setModalLoading(true);
    setModalError(null);
    setShowDetailsModal(true);
    dispatch(clearCurrentOrder());

    const token = localStorage.getItem("authToken");

    if (!token) {
      setModalError("Токен авторизації відсутній. Будь ласка, увійдіть.");
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
      dispatch(fetchOrderById.fulfilled(data, "requestId", orderId));
      console.log("Order details fetched for modal:", data);
    } catch (error: any) {
      setModalError(
        `Помилка завантаження деталей замовлення: ${error.message}`
      );
      console.error("Failed to fetch order details for modal:", error);
      setAuthMessage({ type: "error", text: `Помилка: ${error.message}` });
    } finally {
      setModalLoading(false);
    }
  };

  const closeOrderDetailsModal = () => {
    setShowDetailsModal(false);
    dispatch(clearCurrentOrder());
    setModalError(null);
  };

  const handleCancelOrder = async (orderId: string) => {
    setAuthMessage({
      type: "info",
      text: "Ви впевнені, що хочете скасувати це замовлення? Цю дію не можна буде скасувати.",
    });

    if (
      window.confirm(
        "Ви впевнені, що хочете скасувати це замовлення? Цю дію не можна буде скасувати."
      )
    ) {
      try {
        await dispatch(
          updateOrderStatus({ orderId, status: "Cancelled" })
        ).unwrap();
        setAuthMessage({
          type: "success",
          text: `Замовлення ${orderId} успішно скасовано!`,
        });
        dispatch(fetchMyOrders());
      } catch (error: any) {
        setAuthMessage({
          type: "error",
          text: `Помилка скасування замовлення: ${
            error.message || "Невідома помилка"
          }`,
        });
        console.error("Failed to cancel order:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Мої замовлення
      </h1>

      {sortedUserOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-6">
            У вас ще немає жодного замовлення.
          </p>
          <Button onClick={(e) => handleNav(e, "/")} variant="primary">
            Перейти до покупок
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Номер</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Дата</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                  Сума
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">
                  Статус
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">
                  Дії
                </th>{" "}
              </tr>
            </thead>
            <tbody>
              {sortedUserOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td
                    className="px-4 py-4 font-medium text-gray-500 cursor-pointer hover:underline text-blue-600"
                    onClick={() => openOrderDetailsModal(order.id)}
                  >
                    {" "}
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-gray-800">
                    {new Date(order.date).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900 text-right">
                    {order.total.toLocaleString("uk-UA")} UAH
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        statusClasses[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {" "}
                    {(order.status === "Processing" ||
                      order.status === "Shipped") && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                        aria-label="Скасувати замовлення"
                      >
                        Скасувати
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-3 relative border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
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
            {currentOrder && !modalLoading && !modalError ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold w-1/4">
                        ID Замовлення:
                      </td>
                      <td className="px-3 py-1.5">{currentOrder.id}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Дата:</td>
                      <td
                        className="px-3 py-1.5"
                        dangerouslySetInnerHTML={{
                          __html: currentOrder.date
                            ? `Дата: ${new Date(
                                currentOrder.date
                              ).toLocaleDateString("uk-UA", {
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                              })}, <strong>Час:</strong> ${new Date(
                                currentOrder.date
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
                        {currentOrder.customer?.name || "N/A"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Телефон:</td>
                      <td className="px-3 py-1.5">
                        <a
                          href={`tel:${currentOrder.customer?.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {currentOrder.customer?.phone || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Пошта:</td>
                      <td className="px-3 py-1.5">
                        <a
                          href={`mailto:${currentOrder.customer?.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {currentOrder.customer?.email || "N/A"}
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Доставка:</td>
                      <td className="px-3 py-1.5">
                        {currentOrder.delivery?.method === "pickup"
                          ? "Самовивіз"
                          : `Нова Пошта - ${
                              currentOrder.delivery?.cityName || "N/A"
                            }, ${currentOrder.delivery?.branchName || "N/A"}`}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-1.5 font-semibold">Оплата:</td>
                      <td className="px-3 py-1.5">
                        {currentOrder.payment?.method === "cash"
                          ? "Готівка"
                          : "Картка"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-semibold">Статус:</td>
                      <td className="px-3 py-1.5">
                        <span
                          className={`p-2 text-sm font-semibold rounded-lg border-2
                                     ${
                                       currentOrder.status === "Delivered"
                                         ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                         : ""
                                     }
                                     ${
                                       currentOrder.status === "Shipped"
                                         ? "bg-blue-100 border-blue-300 text-blue-800"
                                         : ""
                                     }
                                     ${
                                       currentOrder.status === "Processing"
                                         ? "bg-amber-100 border-amber-300 text-amber-800"
                                         : ""
                                     }
                                     ${
                                       currentOrder.status === "Cancelled"
                                         ? "bg-red-100 border-red-300 text-red-800"
                                         : ""
                                     }
                                  `}
                        >
                          {currentOrder.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-1">
                  Товари в замовленні:
                </h3>
                {currentOrder.items && currentOrder.items.length > 0 ? (
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
                        {currentOrder.items.map((item: any) => (
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
                            {currentOrder.total?.toLocaleString("uk-UA")} грн
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
              </div>
            ) : (
              !modalLoading &&
              !modalError && (
                <div className="text-center text-gray-500 py-4">
                  <p>Не вдалося завантажити деталі замовлення.</p>
                </div>
              )
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={closeOrderDetailsModal} variant="secondary">
                Закрити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
