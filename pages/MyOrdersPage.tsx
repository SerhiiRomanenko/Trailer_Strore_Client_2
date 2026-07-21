import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchMyOrders,
  updateOrderStatus,
  OrderStatus,
} from "../redux/ordersSlice";
import { ChevronDown, ChevronUp, Package, Copy } from "lucide-react";
import { useToast } from "../components/Toast";
import Modal from "../components/Modal";
import TrailerLoading from "../components/TrailerLoading";

const statusLabels: Record<OrderStatus, string> = {
  Processing: "Обробка",
  Shipped: "В дорозі",
  Delivered: "Доставлено",
  Cancelled: "Скасовано",
};

const statusColors: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  Shipped: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  Delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  Cancelled: "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400",
};

const MyOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading: authLoading } = useAuth();
  const { success, error: showError } = useToast();
  const { list: userOrders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders
  );
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) navigate("/login");
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyOrders());
    }
  }, [currentUser, dispatch]);

  const sortedOrders = useMemo(
    () => [...userOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [userOrders]
  );

  const handleCancelOrder = useCallback(async (orderId: string) => {
    if (!confirm("Скасувати замовлення?")) return;
    setCancellingId(orderId);
    try {
      await dispatch(updateOrderStatus({ orderId, status: "Cancelled" })).unwrap();
      success("Замовлення скасовано");
    } catch {
      showError("Не вдалося скасувати замовлення");
    } finally {
      setCancellingId(null);
    }
  }, [dispatch, success, showError]);

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    success("Номер скопійовано");
  };

  if (authLoading || orderStatus === "loading") {
    return <TrailerLoading label="Завантаження..." />;
  }

  if (!currentUser) return null;

  return (
    <div className="py-4 md:py-6">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4 md:mb-6">
        Мої замовлення
        {sortedOrders.length > 0 && (
          <span className="text-sm font-normal text-[var(--color-text-tertiary)] ml-2">
            ({sortedOrders.length})
          </span>
        )}
      </h1>

      {sortedOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg)] mb-4">
            <Package className="h-7 w-7 text-[var(--color-text-tertiary)]" />
          </div>
          <h2 className="text-sm font-medium text-[var(--color-text)] mb-1">Замовлень ще немає</h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Ваші замовлення з'являться тут після оформлення
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden"
            >
              {/* Order header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[var(--color-bg)] flex-shrink-0">
                    <Package className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
                        {order.id}
                      </span>
                      <button
                        onClick={() => copyOrderId(order.id)}
                        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {new Date(order.date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      statusColors[order.status as OrderStatus]
                    }`}
                  >
                    {statusLabels[order.status as OrderStatus]}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {order.total.toLocaleString("uk-UA")} {order.items?.[0]?.currency || "UAH"}
                  </span>
                </div>
              </div>

              {/* Expand/collapse */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] border-t border-[var(--color-border)] transition-colors"
              >
                {expandedOrder === order.id ? "Приховати" : "Деталі"}
                {expandedOrder === order.id ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {/* Expanded items */}
              {expandedOrder === order.id && (
                <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]/50">
                  <ul className="space-y-1.5 mb-3">
                    {order.items.map((item: any) => (
                      <li key={item.id} className="flex justify-between text-xs">
                        <span className="text-[var(--color-text-secondary)] truncate mr-4">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-[var(--color-text)] flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString("uk-UA")}{" "}
                          {item.currency}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between text-xs">
                    <div className="text-[var(--color-text-tertiary)]">
                      <span className="mr-4">
                        {order.delivery.method === "pickup" ? "Самовивіз" : "Нова Пошта"}
                      </span>
                      <span>{order.payment.method === "cash" ? "Готівка" : "Картка"}</span>
                    </div>

                    {order.status === "Processing" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === order.id ? "Скасовуємо..." : "Скасувати"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Замовлення ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-[var(--color-text-tertiary)]">Покупець: </span>
              <span className="font-medium">{selectedOrder.customer.name}</span>
            </div>
            <ul className="space-y-1">
              {selectedOrder.items.map((item: any) => (
                <li key={item.id} className="flex justify-between text-xs">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString("uk-UA")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--color-border)] pt-2 flex justify-between">
              <span className="text-sm font-medium">Разом</span>
              <span className="text-sm font-bold">
                {selectedOrder.total.toLocaleString("uk-UA")} UAH
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrdersPage;
