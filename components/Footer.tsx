import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  return (
    <footer className="mt-auto">
      {/* Main footer */}
      <div className="bg-[#1a2a3a]">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-bold text-white mb-3">ПричепМаркет</h3>
              <p className="text-xs text-white/60 leading-relaxed max-w-[240px]">
                Надійний партнер у виборі легкових причепів. Широкий асортимент від перевірених виробників.
              </p>
              {/* Social links */}
              {/* <div className="flex items-center gap-2 mt-4">
                <a
                  href="#"
                  className="p-2 rounded-md bg-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-md bg-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div> */}
            </div>

            {/* Catalog */}
            <div>
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Каталог</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" onClick={(e) => handleNav(e, "/")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Причепи
                  </a>
                </li>
                <li>
                  <a href="/details" onClick={(e) => handleNav(e, "/details")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Комплектуючі
                  </a>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Інформація</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/delivery-and-payment" onClick={(e) => handleNav(e, "/delivery-and-payment")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Доставка та оплата
                  </a>
                </li>
                <li>
                  <a href="/contacts" onClick={(e) => handleNav(e, "/contacts")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Контакти
                  </a>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Акаунт</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/my-profile" onClick={(e) => handleNav(e, "/my-profile")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Мій профіль
                  </a>
                </li>
                <li>
                  <a href="/my-orders" onClick={(e) => handleNav(e, "/my-orders")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Мої замовлення
                  </a>
                </li>
                <li>
                  <a href="/favorites" onClick={(e) => handleNav(e, "/favorites")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Обране
                  </a>
                </li>
                <li>
                  <a href="/cart" onClick={(e) => handleNav(e, "/cart")} className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                    Кошик
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Контакти</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="tel:+380679372731" className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    +38 (067) 937-27-31
                  </a>
                </li>
                <li>
                  <a href="mailto:serhiiromanenko13@gmail.com" className="flex items-start gap-2 text-xs text-white/60 hover:text-white transition-colors">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span className="truncate">serhiiromanenko13@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-2 text-xs text-white/60">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  смт. Ворзель, вул. Яблунська, 11
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#15202c]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
            <p className="text-[11px] text-white/40">
              &copy; {new Date().getFullYear()} ПричіпМаркет. Всі права захищено.
            </p>
            <div className="flex items-center gap-4">
              <a href="/contacts" onClick={(e) => handleNav(e, "/contacts")} className="text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                Контакти
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
