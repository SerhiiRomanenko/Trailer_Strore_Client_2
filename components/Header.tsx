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
  Search,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { RootState } from "../redux/store";
import logo from "../components/icons/logo.png";

interface HeaderProps {
  route: string;
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  const { currentUser, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      setMobileSearchOpen(false);
    },
    []
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.history.pushState({}, "", `/?q=${encodeURIComponent(searchQuery.trim())}`);
        window.dispatchEvent(new Event("locationchange"));
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconBtn =
    "relative p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer";

  const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-4 px-1 text-[10px] font-bold text-white bg-[var(--color-accent)] rounded-full">
        {count}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-50 shadow-[var(--shadow-md)]">
      {/* Top bar */}
      <div className="bg-[#1a2a3a]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center h-9 text-[11px] gap-4 md:gap-6">
            {/* Phone */}
            <a
              href="tel:+380679372731"
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors shrink-0"
            >
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">+38 (067) 937-27-31</span>
            </a>

            {/* City */}
            <span className="flex items-center gap-1 text-white/70 shrink-0">
              <MapPin className="h-3 w-3" />
              <span>Україна</span>
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right links - desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/delivery-and-payment"
                onClick={(e) => handleNav(e, "/delivery-and-payment")}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Доставка
              </a>
              <a
                href="/contacts"
                onClick={(e) => handleNav(e, "/contacts")}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Контакти
              </a>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label={theme === "dark" ? "Світла тема" : "Темна тема"}
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>

              {!loading && currentUser && (
                <>
                  <span className="border-l border-white/20 h-3" />
                  <span className="text-white/70">{currentUser.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-[var(--color-header-bg)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center h-14 md:h-16 gap-2 md:gap-4">
            {/* Logo */}
            <a href="/" onClick={(e) => handleNav(e, "/")} className="flex items-center flex-shrink-0 cursor-pointer">
              <img
                src={logo}
                alt="ПричепМаркет"
                className="h-10 md:h-12 object-contain"
              />
            </a>

            {/* Catalog button (Rozetka style) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex-shrink-0"
            >
              <Menu className="h-4 w-4" />
              Каталог
            </button>

            {/* Desktop nav (Rozetka catalog-style tabs) */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              <NavLink path="/" current={route} onClick={handleNav} label="Причепи" />
              <NavLink path="/details" current={route} onClick={handleNav} label="Комплектуючі" />
              {currentUser?.role === "admin" && (
                <NavLink path="/admin" current={route} onClick={handleNav} label="Адмін" accent />
              )}
            </nav>

            {/* Search bar (Rozetka style) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
              <div className="flex w-full rounded-md overflow-hidden border border-white/20 focus-within:border-white/50 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук товарів..."
                  className="flex-1 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 transition-colors flex-shrink-0"
                  aria-label="Шукати"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Spacer */}
            <div className="hidden md:block flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Favorites */}
              <a
                href="/favorites"
                onClick={(e) => handleNav(e, "/favorites")}
                className={iconBtn}
                title="Обране"
              >
                <Star className="h-5 w-5" />
                <Badge count={favoritesCount} />
              </a>

              {/* Cart */}
              <a
                href="/cart"
                onClick={(e) => handleNav(e, "/cart")}
                className={iconBtn}
                title="Кошик"
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge count={totalCartItems} />
              </a>

              {/* User menu - desktop */}
              {!loading && currentUser && (
                <div className="hidden md:relative pl-2" ref={userMenuRef} style={{ left: 0 }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-surface)] rounded-lg shadow-[var(--shadow-xl)] border border-[var(--color-border)] py-1 animate-slide-down">
                      <p className="px-3 py-1.5 text-xs font-medium text-[var(--color-text)] truncate border-b border-[var(--color-border)]">
                        {currentUser.name}
                      </p>
                      <a
                        href="/my-profile"
                        onClick={(e) => handleNav(e, "/my-profile")}
                        className="block px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer"
                      >
                        Мій профіль
                      </a>
                      <a
                        href="/my-orders"
                        onClick={(e) => handleNav(e, "/my-orders")}
                        className="block px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer"
                      >
                        Мої замовлення
                      </a>
                      <div className="border-t border-[var(--color-border)] my-0.5" />
                      <button
                        onClick={(e) => {
                          logout();
                          handleNav(e, "/login");
                        }}
                        className="w-full text-left px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Вийти
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Login / Register - desktop */}
              {!loading && !currentUser && (
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <button
                    onClick={(e) => handleNav(e as any, "/login")}
                    className="text-[13px] font-medium px-3 py-1.5 rounded-md text-white/90 hover:text-white border border-white/30 hover:border-white/50 transition-colors cursor-pointer"
                  >
                    Вхід
                  </button>
                  <button
                    onClick={(e) => handleNav(e as any, "/register")}
                    className="text-[13px] font-medium px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
                  >
                    Реєстрація
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearchOpen && (
            <form onSubmit={handleSearch} className="pb-3 animate-slide-down">
              <div className="flex rounded-md overflow-hidden border border-white/20">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук товарів..."
                  className="flex-1 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 transition-colors flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-white/10 bg-[var(--color-header-bg)] ${
          mobileMenuOpen ? "max-h-[75vh]" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-2">
          <div className="flex flex-col gap-0.5">
            {[
              { path: "/", label: "Причепи" },
              { path: "/details", label: "Комплектуючі" },
              { path: "/delivery-and-payment", label: "Оплата та доставка" },
              { path: "/contacts", label: "Контакти" },
              { path: "/favorites", label: `Обране (${favoritesCount})` },
              { path: "/cart", label: `Кошик (${totalCartItems})` },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNav(e, item.path)}
                className="block text-sm font-medium px-3 py-2.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                {item.label}
              </a>
            ))}

            {!loading && !currentUser && (
              <>
                <div className="border-t border-white/10 my-1" />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={(e) => handleNav(e as any, "/login")}
                    className="flex-1 text-sm font-medium py-2 rounded-md border border-white/30 text-white cursor-pointer"
                  >
                    Вхід
                  </button>
                  <button
                    onClick={(e) => handleNav(e as any, "/register")}
                    className="flex-1 text-sm font-medium py-2 rounded-md bg-[var(--color-accent)] text-white cursor-pointer"
                  >
                    Реєстрація
                  </button>
                </div>
              </>
            )}
            {!loading && currentUser && (
              <>
                <div className="border-t border-white/10 my-1" />
                <a
                  href="/my-profile"
                  onClick={(e) => handleNav(e, "/my-profile")}
                  className="block text-sm font-medium px-3 py-2.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  Мій профіль
                </a>
                <a
                  href="/my-orders"
                  onClick={(e) => handleNav(e, "/my-orders")}
                  className="block text-sm font-medium px-3 py-2.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  Мої замовлення
                </a>
                <button
                  onClick={(e) => {
                    logout();
                    handleNav(e, "/login");
                  }}
                  className="text-left text-sm font-medium px-3 py-2.5 rounded-md text-red-300 hover:text-red-200 hover:bg-white/10 cursor-pointer"
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
  accent,
}: {
  path: string;
  current: string;
  onClick: (e: React.MouseEvent, path: string) => void;
  label: string;
  accent?: boolean;
}) {
  const isActive = path === "/" ? current === "/" : current.startsWith(path);
  return (
    <a
      href={path}
      onClick={(e) => onClick(e, path)}
      className={`text-[13px] font-medium px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
        accent
          ? "text-[var(--color-accent)] hover:bg-white/10"
          : isActive
          ? "text-white bg-white/15 font-semibold"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </a>
  );
}

export default Header;
