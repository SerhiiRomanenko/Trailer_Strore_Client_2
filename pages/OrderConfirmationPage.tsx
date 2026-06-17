import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CheckCircle2, Copy, ArrowRight } from "lucide-react";
import { useToast } from "../components/Toast";

interface Props {
  orderId: string;
}

const OrderConfirmationPage: React.FC<Props> = ({ orderId }) => {
  const order = useSelector((state: RootState) =>
    state.orders.list.find((o) => o.id === orderId)
  );
  const { success } = useToast();

  useEffect(() => {
    document.title = "Замовлення підтверджено | ПричепМаркет";
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    success("Номер замовлення скопійовано");
  };

  const getDeliveryText = () => {
    if (!order) return "";
    if (order.delivery.method === "pickup") return "Самовивіз: смт. Ворзель, вул. Яблунська, 11";
    if (order.delivery.cityName && order.delivery.branchName)
      return `Нова Пошта: ${order.delivery.cityName}, ${order.delivery.branchName}`;
    return "Нова Пошта";
  };

  const getPaymentText = () => {
    if (!order) return "";
    return order.payment.method === "cash" ? "Готівка" : "Картка";
  };

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-2">Замовлення не знайдено</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">Ми не змогли знайти це замовлення</p>
        <a href="/" onClick={(e) => handleNav(e, "/")}>
          <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5">
            На головну <ArrowRight className="h-4 w-4" />
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-1">
          Дякуємо за замовлення!
        </h1>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Ми зв'яжемося з вами найближчим часом для підтвердження
        </p>
      </div>

      {/* Order details */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        {/* Order ID */}
        <div className="px-4 md:px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-tertiary)]">Номер замовлення</span>
          <button
            onClick={copyOrderId}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            <code className="font-mono">{order.id}</code>
            <Copy className="h-3 w-3" />
          </button>
        </div>

        <div className="px-4 md:px-6 py-4 space-y-3">
          {/* Details */}
          {[
            { label: "Дата", value: new Date(order.date).toLocaleDateString("uk-UA") },
            { label: "Покупець", value: order.customer.name },
            { label: "Email", value: order.customer.email },
            { label: "Телефон", value: order.customer.phone },
            { label: "Доставка", value: getDeliveryText() },
            { label: "Оплата", value: getPaymentText() },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-[var(--color-text-tertiary)]">{label}</span>
              <span className="font-medium text-[var(--color-text)] text-right max-w-[60%]">{value}</span>
            </div>
          ))}

          {/* Items */}
          <div className="pt-3 border-t border-[var(--color-border)]">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
              Товари
            </h3>
            <ul className="space-y-1.5">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)] truncate mr-4">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[var(--color-text)] flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString("uk-UA")} {item.currency}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-[var(--color-border)] flex justify-between">
            <span className="text-sm font-medium text-[var(--color-text)]">Разом</span>
            <span className="text-base font-bold text-[var(--color-text)]">
              {order.total.toLocaleString("uk-UA")} UAH
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <a href="/" onClick={(e) => handleNav(e, "/")} className="flex-1">
          <button className="w-full text-sm font-semibold py-2.5 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2">
            Продовжити покупки <ArrowRight className="h-4 w-4" />
          </button>
        </a>
        <a href="/my-orders" onClick={(e) => handleNav(e, "/my-orders")}>
          <button className="text-sm font-medium py-2.5 px-4 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors">
            Мої замовлення
          </button>
        </a>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
