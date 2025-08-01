import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import Button from "../components/Button";
import TrashIcon from "../components/icons/TrashIcon";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    document.title = "Ваш кошик | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Перегляньте товари у вашому кошику та переходьте до оформлення замовлення."
      );
    }
  }, []);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncrease = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecrease = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">
          Ваш кошик порожній
        </h1>
        <p className="text-slate-500 mt-3 mb-6">
          Схоже, ви ще нічого не додали до кошика.
        </p>
        <Button onClick={(e) => handleNav(e, "/")} variant="primary">
          Почати покупки
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Ваш кошик</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-slate-200 last:border-b-0"
          >
            <div className="flex items-center gap-4 flex-grow">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg border border-slate-200"
              />
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {item.name}
                </h2>
                <p className="text-slate-500">
                  {item.price.toLocaleString("uk-UA")} {item.currency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between">
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
                <button
                  onClick={() => handleDecrease(item.id)}
                  className="px-3 py-1 text-xl font-bold text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-lg">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncrease(item.id)}
                  className="px-3 py-1 text-xl font-bold text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <p className="text-xl font-bold text-slate-900 w-36 text-right">
                {(item.price * item.quantity).toLocaleString("uk-UA")}{" "}
                {item.currency}
              </p>
              <button
                onClick={() => handleRemove(item.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-6">
        <div className="text-right">
          <p className="text-lg text-slate-600">Загальна сума:</p>
          <p className="text-4xl font-black text-slate-900">
            {totalPrice.toLocaleString("uk-UA")} {cartItems[0].currency}
          </p>
        </div>
        <Button
          variant="primary"
          className="w-full sm:w-auto"
          onClick={(e) => handleNav(e, "/checkout")}
        >
          Оформити замовлення
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
