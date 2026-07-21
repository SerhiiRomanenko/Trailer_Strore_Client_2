import React, { useEffect } from "react";

interface OrderNotificationProps {
  newCount: number;
  show: boolean;
  onDismiss: () => void;
  onNavigate: () => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({
  newCount,
  show,
  onDismiss,
  onNavigate,
}) => {
  useEffect(() => {
    if (show) {
      const utterance = "speechSynthesis" in window
        ? window.speechSynthesis
        : null;
      if (utterance) {
        const msg = new SpeechSynthesisUtterance(
          newCount === 1
            ? "Увага! Нове замовлення"
            : `Увага! ${newCount} нових замовлень`
        );
        msg.lang = "uk-UA";
        msg.volume = 0.7;
        utterance.speak(msg);
      }
    }
  }, [show, newCount]);

  if (!show) return null;

  const pluralLabel =
    newCount === 1
      ? "1 нове замовлення"
      : newCount < 10
        ? `${newCount} нових замовлень`
        : `${newCount} нових замовлень`;

  return (
    <>
      <div
        className="fixed inset-0 z-[80]"
        aria-hidden="true"
      />
      <div className="fixed bottom-6 right-6 z-[90] max-w-sm w-full animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-400 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <svg
                className="h-7 w-7 text-white animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C10.9 2 10 2.9 10 4v2.01C7.03 5.83 4.83 8.03 4 11H2v2h2.09c.78 3.59 3.65 6.46 7.24 7.24.63.13 1.09.54 1.46 1.03.4.55.93.73 1.54.73.61 0 1.15-.18 1.54-.73.37-.49.83-.9 1.46-1.03C19.07 19.5 21.94 16.63 22.09 13H24v-2h-2c-.83-3.13-3.03-5.33-6-6.99V4c0-1.1-.9-2-2-2zm-1 14.07c-2.7-.66-4.87-2.83-5.53-5.53H20.53C19.87 13.24 17.7 15.41 15 16.07V20h-2v-3.93zm0-14.07c0-.55.45-1 1-1s1 .45 1 1v2H11V2z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {newCount}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg">Нові замовлення!</h3>
          </div>

          <div className="px-4 py-4">
            <p className="text-gray-700 text-base mb-4">
              Ви отримали <strong className="text-amber-600">{pluralLabel}</strong>.
              Перейдіть до сторінки замовлень, щоб переглянути деталі.
            </p>

            <div className="flex gap-2">
              <button
                onClick={onNavigate}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
              >
                До замовлень
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm cursor-pointer"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderNotification;
