import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../redux/cartSlice";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    document.title = "Кошик | ПричепМаркет";
  }, []);

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
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg)] mb-4">
          <ShoppingCart className="h-7 w-7 text-[var(--color-text-tertiary)]" />
        </div>
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-1">Кошик порожній</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
          Додайте товари для оформлення замовлення
        </p>
        <a href="/" onClick={(e) => handleNav(e, "/")}>
          <button className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] inline-flex items-center gap-1.5">
            Переглянути каталог <ArrowRight className="h-4 w-4" />
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-6">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4 md:mb-6">
        Кошик
        <span className="text-sm font-normal text-[var(--color-text-tertiary)] ml-2">
          ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} товарів)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-3 md:p-4"
            >
              <div className="flex gap-3 md:gap-4">
                {/* Image */}
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/100/f5f5f7/999?text=--"}
                  alt={item.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md bg-[var(--color-bg)] flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-medium text-[var(--color-text)] line-clamp-2 mb-1">
                    {item.name}
                  </h2>
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
                    {item.price.toLocaleString("uk-UA")} {item.currency}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border border-[var(--color-border)] rounded-md">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="p-1.5 hover:bg-[var(--color-surface-hover)] transition-colors rounded-l-md"
                        aria-label="Зменшити кількість"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="p-1.5 hover:bg-[var(--color-surface-hover)] transition-colors rounded-r-md"
                        aria-label="Збільшити кількість"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Total + Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {(item.price * item.quantity).toLocaleString("uk-UA")} {item.currency}
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1.5 text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors"
                        aria-label="Видалити"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-4 md:p-5 sticky top-16">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Підсумок</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Товари</span>
                <span className="text-[var(--color-text)]">
                  {totalPrice.toLocaleString("uk-UA")} {cartItems[0]?.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Доставка</span>
                <span className="text-[var(--color-success)] font-medium">Безкоштовно</span>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-[var(--color-text)]">Разом</span>
                <span className="text-base font-bold text-[var(--color-text)]">
                  {totalPrice.toLocaleString("uk-UA")} {cartItems[0]?.currency}
                </span>
              </div>
            </div>

            <a href="/checkout" onClick={(e) => handleNav(e, "/checkout")}>
              <button className="w-full text-sm font-semibold py-3 px-4 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2">
                Оформити замовлення <ArrowRight className="h-4 w-4" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
