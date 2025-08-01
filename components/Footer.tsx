import React from "react";
import PhoneIcon from "./icons/PhoneIcon";
import EnvelopeIcon from "./icons/EnvelopeIcon";

const Footer: React.FC = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white tracking-wider font-['Roboto_Slab'] mb-3">
              ПричепМаркет<span className="text-orange-500">.</span>
            </h3>
            <p className="text-sm max-w-md">
              Ваш надійний партнер у виборі якісних легкових причепів. Ми
              пропонуємо широкий асортимент від перевірених виробників для
              будь-яких потреб.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Навігація</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNav(e, "/")}
                  className="hover:text-orange-400 transition-colors"
                >
                  Причепи
                </a>
              </li>
              <li>
                <a
                  href="/details"
                  onClick={(e) => handleNav(e, "/details")}
                  className="hover:text-orange-400 transition-colors"
                >
                  Комплектуючі
                </a>
              </li>
              <li>
                <a
                  href="/delivery-and-payment"
                  onClick={(e) => handleNav(e, "/delivery-and-payment")}
                  className="hover:text-orange-400 transition-colors"
                >
                  Доставка та оплата
                </a>
              </li>
              <li>
                <a
                  href="/contacts"
                  onClick={(e) => handleNav(e, "/contacts")}
                  className="hover:text-orange-400 transition-colors"
                >
                  Контакти
                </a>
              </li>
              <li>
                <a
                  href="/my-orders"
                  onClick={(e) => handleNav(e, "/my-orders")}
                  className="hover:text-orange-400 transition-colors"
                >
                  Мої замовлення
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Контакти</h3>
            <div className="text-sm space-y-3">
              <p className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:380679372731"
                  className="hover:text-orange-400 transition-colors"
                >
                  +38 (067) 937-27-31
                </a>
              </p>
              <p className="flex items-start gap-3">
                <EnvelopeIcon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:serhiiromanenko13@gmail.com"
                  className="hover:text-orange-400 transition-colors"
                >
                  serhiiromanenko13@gmail.com
                </a>
              </p>
              <p className="mt-2">смт. Ворзель, вул. Яблунська, 11</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} ПричепМаркет. Всі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
