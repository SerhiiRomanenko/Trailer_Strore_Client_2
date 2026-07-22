import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  Star,
  Menu,
  X,
  User,
  ChevronDown,
  Sun,
  Moon,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { RootState } from "../redux/store";
import logo from "../components/icons/logo.png";

interface HeaderProps {
  route: string;
  showFilter?: boolean;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

const Header: React.FC<HeaderProps> = ({ route, showFilter, onOpenFilters, activeFilterCount = 0 }) => {
  const { currentUser, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const totalCartItems = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const favoritesCount = useSelector(
    (state: RootState) => state.favorites.ids.length
  );

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, path: string) => {
      e.preventDefault();
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("locationchange"));
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
    },
    []
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close user dropdown
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }

      // Close mobile menu
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  const iconBtn =
    "relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer";

  const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-4 px-1 text-[10px] font-bold text-white bg-[var(--color-accent)] rounded-full">
        {count}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center h-14 md:h-16 gap-3 md:gap-4">
          {/* Mobile menu toggle */}
          <button
            ref={mobileToggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNav(e, "/")}
            className="flex items-center flex-shrink-0 cursor-pointer"
          >
            <img src={logo} alt="ПричіпМаркет" className="h-9 md:h-11 object-contain" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            <NavLink path="/" current={route} onClick={handleNav} label="Причепи" />
            <NavLink path="/details" current={route} onClick={handleNav} label="Комплектуючі" />
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Phone */}
            <a
              href="tel:+380679372731"
              className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors px-2 py-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"
            >
              <Phone className="h-3.5 w-3.5" />
              +38 (067) 937-27-31
            </a>

            {/* Mobile filter button */}
            {showFilter && (
              <button
                onClick={onOpenFilters}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  activeFilterCount > 0
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                <SlidersHorizontal className="h-[18px] w-[18px]" />
                {activeFilterCount > 0 && <Badge count={activeFilterCount} />}
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={iconBtn}
              aria-label={theme === "dark" ? "Світла тема" : "Темна тема"}
            >
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>

            {/* Favorites */}
            <a
              href="/favorites"
              onClick={(e) => handleNav(e, "/favorites")}
              className={iconBtn}
              title="Обране"
            >
              <Star className="h-[18px] w-[18px]" />
              <Badge count={favoritesCount} />
            </a>

            {/* Cart */}
            <a
              href="/cart"
              onClick={(e) => handleNav(e, "/cart")}
              className={iconBtn}
              title="Кошик"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <Badge count={totalCartItems} />
            </a>

            {/* User menu */}
            {!loading && currentUser && (
              <div className="relative pl-1" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                >
                  <User className="h-[18px] w-[18px]" />
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] py-1.5 animate-slide-down">
                    <p className="px-3 py-2 text-xs font-semibold text-[var(--color-text)] truncate border-b border-[var(--color-border)]">
                      {currentUser.name}
                    </p>
                    <a
                      href="/my-profile"
                      onClick={(e) => handleNav(e, "/my-profile")}
                      className="block px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer rounded-lg mx-1"
                    >
                      Мій профіль
                    </a>
                    <a
                      href="/my-orders"
                      onClick={(e) => handleNav(e, "/my-orders")}
                      className="block px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer rounded-lg mx-1"
                    >
                      Мої замовлення
                    </a>
                    {currentUser?.role === "admin" && (
                      <a
                        href="/admin"
                        onClick={(e) => handleNav(e, "/admin")}
                        className="block px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer rounded-lg mx-1"
                      >
                        Адмін-панель
                      </a>
                    )}
                    <div className="border-t border-[var(--color-border)] my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 cursor-pointer"
                    >
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Login button - desktop */}
            {!loading && !currentUser && (
              <button
                onClick={(e) => handleNav(e as any, "/login")}
                className="hidden md:flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer ml-1"
              >
                <User className="h-[18px] w-[18px]" />
                Увійти
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-[var(--color-border)] bg-[var(--color-surface)] ${
          mobileMenuOpen ? "max-h-[75vh]" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-1">
            {[
              { path: "/", label: "Причепи" },
              { path: "/details", label: "Комплектуючі" },
              { path: "/delivery-and-payment", label: "Оплата та доставка" },
              { path: "/contacts", label: "Контакти" },
              { path: "/favorites", label: `Обране (${favoritesCount})` },
              { path: "/cart", label: `Кошик (${totalCartItems})` },
            ].map((item) => {
              const itemActive = item.path === "/" ? route === "/" || route.startsWith("/product/") : route.startsWith(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNav(e, item.path)}
                  className={`block text-sm font-medium px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    itemActive
                      ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {currentUser?.role === "admin" && (
              <a
                href="/admin"
                onClick={(e) => handleNav(e, "/admin")}
                className="block text-sm font-medium px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                Адмін-панель
              </a>
            )}

            {!loading && !currentUser && (
              <>
                <div className="border-t border-[var(--color-border)] my-1" />
                <button
                  onClick={(e) => handleNav(e as any, "/login")}
                  className="w-full text-sm font-medium py-2.5 rounded-lg bg-[var(--color-primary)] text-white cursor-pointer pt-1"
                >
                  Увійти
                </button>
              </>
            )}
            {!loading && currentUser && (
              <>
                <div className="border-t border-[var(--color-border)] my-1" />
                <a
                  href="/my-profile"
                  onClick={(e) => handleNav(e, "/my-profile")}
                  className="block text-sm font-medium px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  Мій профіль
                </a>
                <a
                  href="/my-orders"
                  onClick={(e) => handleNav(e, "/my-orders")}
                  className="block text-sm font-medium px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  Мої замовлення
                </a>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  Вийти
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

    </header>
  );
};

function NavLink({
  path,
  current,
  onClick,
  label,
}: {
  path: string;
  current: string;
  onClick: (e: React.MouseEvent, path: string) => void;
  label: string;
}) {
  const isActive = path === "/" ? current === "/" || current.startsWith("/product/") : current.startsWith(path);
  return (
    <a
      href={path}
      onClick={(e) => onClick(e, path)}
      aria-current={isActive ? "page" : undefined}
      className={`text-[13px] font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
        isActive
          ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      {label}
    </a>
  );
}

export default Header;
