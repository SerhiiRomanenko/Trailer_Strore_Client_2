import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Button from "../components/Button";

interface Props {
  orderId: string;
}

const OrderConfirmationPage: React.FC<Props> = ({ orderId }) => {
  const order = useSelector((state: RootState) =>
    state.orders.list.find((o) => o.id === orderId)
  );

  useEffect(() => {
    document.title = "Замовлення підтверджено | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Дякуємо за ваше замовлення! Деталі підтвердження."
      );
    }
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  if (!order) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-red-600">
          Замовлення не знайдено
        </h1>
        <p className="text-slate-500 mt-3 mb-6">
          Ми не змогли знайти замовлення, яке ви шукаєте.
        </p>
        <Button variant="primary" onClick={(e) => handleNav(e, "/")}>
          На головну
        </Button>
      </div>
    );
  }

  const getDeliveryText = () => {
    if (order.delivery.method === "pickup") {
      return "Самовивіз зі складу: м. Ворзель, вул. Яблунська, 11";
    }
    if (order.delivery.cityName && order.delivery.branchName) {
      return `Нова Пошта: ${order.delivery.cityName}, ${order.delivery.branchName}`;
    }
    return 'Доставка "Нова Пошта" (деталі уточнюються)';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl text-emerald-600">✓</span>
      </div>
      <h1 className="text-3xl font-black text-slate-900">
        Дякуємо за ваше замовлення!
      </h1>
      <p className="text-slate-500 mt-3">
        Ваше замовлення було успішно розміщено.
      </p>
      <p className="text-slate-500 mt-1">
        Ми зв'яжемося з вами найближчим часом для уточнення деталей.
      </p>

      <div className="mt-8 text-left bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">
          Деталі замовлення
        </h2>
        <div className="flex justify-between">
          <span className="text-slate-500">Номер замовлення:</span>
          <span className="font-semibold text-slate-800">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Дата замовлення:</span>
          <span className="font-semibold text-slate-800">
            {new Date(order.date).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Покупець:</span>
          <span className="font-semibold text-slate-800">
            {order.customer.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Доставка:</span>
          <span className="font-semibold text-slate-800 text-right">
            {getDeliveryText()}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">Загальна сума:</span>
          <span className="font-extrabold text-xl text-slate-900">
            {order.total.toLocaleString("uk-UA")} UAH
          </span>
        </div>

        <div>
          <h3 className="font-semibold mt-4 pt-4 border-t border-slate-200 text-slate-700">
            Товари:
          </h3>
          <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name}{" "}
                <span className="text-slate-500">(x {item.quantity})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        variant="primary"
        className="mt-8"
        onClick={(e) => handleNav(e, "/")}
      >
        Продовжити покупки
      </Button>
    </div>
  );
};

export default OrderConfirmationPage;
