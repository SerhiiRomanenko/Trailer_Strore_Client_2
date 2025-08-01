import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "./icons/ShoppingCartIcon";
import StarIcon from "./icons/StarIcon";
import BarsIcon from "./icons/BarsIcon";
import XMarkIcon from "./icons/XMarkIcon";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import { RootState } from "../redux/store";
import UserCircleIcon from "./icons/UserCircleIcon";

interface HeaderProps {
  route: string;
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  const { currentUser, logout, loading } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalCartItems = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const favoritesCount = useSelector(
    (state: RootState) => state.favorites.ids.length
  );

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
    setMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClasses = (path: string) => {
    const base =
      "relative text-md font-medium text-slate-300 hover:text-white transition-colors duration-300 py-2";
    const isActive = route === path;
    return `${base} ${
      isActive
        ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500"
        : ""
    }`;
  };

  const mobileNavLinkClasses = (path: string) => {
    const base =
      "block text-base font-medium transition-colors px-4 py-3 rounded-md";
    const isActive = route === path;
    return `${base} ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  };

  const UserAvatar = () =>
    currentUser?.avatar ? (
      <img
        src={currentUser.avatar}
        alt="User Avatar"
        className="h-8 w-8 rounded-full object-cover"
      />
    ) : (
      <UserCircleIcon className="h-8 w-8 text-slate-400" />
    );

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-8">
              <a
                href="/"
                onClick={(e) => handleNav(e, "/")}
                className="flex items-center gap-2 text-3xl font-bold text-white tracking-wider font-['Roboto_Slab']"
              >
                <img
                  src="../components/icons/logo.png"
                  alt="ПричепМаркет"
                  className="h-16 w-auto max-w-[160px] md:max-w-[120px] lg:max-w-[160px] object-contain"
                />
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <a
                  href="/"
                  onClick={(e) => handleNav(e, "/")}
                  className={navLinkClasses("/")}
                >
                  Причепи
                </a>
                <a
                  href="/details"
                  onClick={(e) => handleNav(e, "/details")}
                  className={navLinkClasses("/details")}
                >
                  Комплектуючі
                </a>
                <a
                  href="/delivery-and-payment"
                  onClick={(e) => handleNav(e, "/delivery-and-payment")}
                  className={navLinkClasses("/delivery-and-payment")}
                >
                  Оплата та доставка
                </a>
                <a
                  href="/contacts"
                  onClick={(e) => handleNav(e, "/contacts")}
                  className={navLinkClasses("/contacts")}
                >
                  Контакти
                </a>
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {currentUser?.role === "admin" && (
                <a
                  href="/admin"
                  onClick={(e) => handleNav(e, "/admin")}
                  className="text-sm font-semibold text-orange-400 hover:text-orange-500 px-3 py-2 rounded-lg"
                >
                  Адмін панель
                </a>
              )}
              <a
                href="/favorites"
                onClick={(e) => handleNav(e, "/favorites")}
                className="relative group p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="View favorites"
              >
                <StarIcon className="h-6 w-6" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </a>
              <a
                href="/cart"
                onClick={(e) => handleNav(e, "/cart")}
                className="relative group p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="View shopping cart"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </a>
              <div
                className="pl-2 border-l border-slate-700 ml-2 relative"
                ref={userMenuRef}
              >
                {!loading &&
                  (currentUser ? (
                    <div>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700"
                      >
                        <UserAvatar />
                        <span className="hidden sm:inline">
                          Привіт, {currentUser.name.split(" ")[0]}
                        </span>
                      </button>
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-10">
                          <a
                            href="/my-profile"
                            onClick={(e) => handleNav(e, "/my-profile")}
                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                          >
                            Мій профіль
                          </a>
                          <a
                            href="/my-orders"
                            onClick={(e) => handleNav(e, "/my-orders")}
                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                          >
                            Мої замовлення
                          </a>
                          <button
                            onClick={(e) => {
                              logout();
                              handleNav(e, "/login");
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                          >
                            Вийти
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => handleNav(e as any, "/login")}
                        variant="ghost"
                        className="!py-2 !px-3 text-sm"
                      >
                        Вхід
                      </Button>
                      <Button
                        onClick={(e) => handleNav(e as any, "/register")}
                        variant="primary"
                        className="!py-2 !px-4 text-sm"
                      >
                        Реєстрація
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Open menu"
                className="p-2 text-slate-300"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <BarsIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-slate-900 shadow-lg transition-all duration-300 ease-in-out overflow-y-hidden ${
          isMobileMenuOpen ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-1">
            {currentUser?.role === "admin" && (
              <a
                href="/admin"
                onClick={(e) => handleNav(e, "/admin")}
                className={mobileNavLinkClasses("/admin")}
              >
                Адмін
              </a>
            )}
            {currentUser && (
              <>
                <a
                  href="/my-profile"
                  onClick={(e) => handleNav(e, "/my-profile")}
                  className={mobileNavLinkClasses("/my-profile")}
                >
                  Мій профіль
                </a>
                <a
                  href="/my-orders"
                  onClick={(e) => handleNav(e, "/my-orders")}
                  className={mobileNavLinkClasses("/my-orders")}
                >
                  Мої замовлення
                </a>
              </>
            )}
            <a
              href="/"
              onClick={(e) => handleNav(e, "/")}
              className={mobileNavLinkClasses("/")}
            >
              Причепи
            </a>
            <a
              href="/details"
              onClick={(e) => handleNav(e, "/details")}
              className={mobileNavLinkClasses("/details")}
            >
              Комплектуючі
            </a>
            <a
              href="/delivery-and-payment"
              onClick={(e) => handleNav(e, "/delivery-and-payment")}
              className={mobileNavLinkClasses("/delivery-and-payment")}
            >
              Оплата та доставка
            </a>
            <a
              href="/contacts"
              onClick={(e) => handleNav(e, "/contacts")}
              className={mobileNavLinkClasses("/contacts")}
            >
              Контакти
            </a>
            <a
              href="/favorites"
              onClick={(e) => handleNav(e, "/favorites")}
              className={mobileNavLinkClasses("/favorites")}
            >
              Обране ({favoritesCount})
            </a>
            <a
              href="/cart"
              onClick={(e) => handleNav(e, "/cart")}
              className={mobileNavLinkClasses("/cart")}
            >
              Кошик ({totalCartItems})
            </a>
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-700">
            {!loading &&
              (currentUser ? (
                <div className="flex items-center justify-between px-4">
                  <span className="font-medium text-slate-300">
                    Привіт, {currentUser.name.split(" ")[0]}
                  </span>
                  <Button
                    onClick={(e) => {
                      logout();
                      handleNav(e, "/login");
                    }}
                    variant="ghost"
                    className="!py-2 !px-3 text-sm"
                  >
                    Вийти
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={(e) => handleNav(e, "/login")}
                    variant="ghost"
                    className="flex-1"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={(e) => handleNav(e, "/register")}
                    variant="primary"
                    className="flex-1"
                  >
                    Реєстрація
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
