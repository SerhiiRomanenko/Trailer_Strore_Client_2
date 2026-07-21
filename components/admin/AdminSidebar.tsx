// src/components/admin/AdminSidebar.tsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import DashboardIcon from "../icons/DashboardIcon";
import PackageIcon from "../icons/PackageIcon";
import ClipboardListIcon from "../icons/ClipboardListIcon";
import UsersIcon from "../icons/UsersIcon";
import ArrowUturnLeftIcon from "../icons/ArrowUturnLeftIcon";
import ArrowLeftOnRectangleIcon from "../icons/ArrowLeftOnRectangleIcon";
import WrenchScrewdriverIcon from "../icons/WrenchScrewdriverIcon";
import { useNewOrdersCount } from "../../hooks/useNewOrdersCount";
import OrderNotification from "./OrderNotification";

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface AdminSidebarProps {
  activeRoute: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { path: "/admin", label: "Панель керування", icon: DashboardIcon },
  { path: "/admin/products", label: "Причепи", icon: PackageIcon },
  {
    path: "/admin/accessories",
    label: "Комплектуючі",
    icon: WrenchScrewdriverIcon,
  },
  { path: "/admin/orders", label: "Замовлення", icon: ClipboardListIcon },
  { path: "/admin/users", label: "Користувачі", icon: UsersIcon },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeRoute,
  isOpen,
  setIsOpen,
}) => {
  const { logout } = useAuth();
  const { newCount, showPopup, dismiss, markChecked } = useNewOrdersCount();

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    if (path === "/admin/orders") {
      markChecked();
    }
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleNavigateToOrders = () => {
    markChecked();
    window.history.pushState({}, "", "/admin/orders");
    window.dispatchEvent(new Event("locationchange"));
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const linkClasses = (path: string, currentRoute: string) => {
    const base =
      "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 cursor-pointer";
    const isActive =
      path === "/admin" ? currentRoute === path : currentRoute.startsWith(path);
    return `${base} ${
      isActive
        ? "bg-amber-100 text-amber-700 font-semibold"
        : "hover:bg-gray-200"
    }`;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 md:opacity-0" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-screen bg-white transition-transform duration-300 transform z-50
                   ${
                     isOpen ? "translate-x-0" : "-translate-x-full"
                   } md:relative md:translate-x-0
                   md:w-64 border-r border-gray-200 p-4 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-8 md:hidden">
          <div className="text-2xl font-bold text-gray-900 px-2">
            Адмін панель
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-600 cursor-pointer"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="md:block">
          <div className="text-2xl font-bold text-gray-900 mb-8 px-2 hidden md:block">
            <a href="/admin" onClick={(e) => handleNav(e, "/admin")}>
              Адмін панель
            </a>
          </div>

          {/* New orders notification badge */}
          {newCount > 0 && !activeRoute.startsWith("/admin/orders") && (
            <div
              onClick={handleNavigateToOrders}
              className="mb-4 mx-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <svg className="h-5 w-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C10.9 2 10 2.9 10 4v2.01C7.03 5.83 4.83 8.03 4 11H2v2h2.09c.78 3.59 3.65 6.46 7.24 7.24.63.13 1.09.54 1.46 1.03.4.55.93.73 1.54.73.61 0 1.15-.18 1.54-.73.37-.49.83-.9 1.46-1.03C19.07 19.5 21.94 16.63 22.09 13H24v-2h-2c-.83-3.13-3.03-5.33-6-6.99V4c0-1.1-.9-2-2-2zm-1 14.07c-2.7-.66-4.87-2.83-5.53-5.53H20.53C19.87 13.24 17.7 15.41 15 16.07V20h-2v-3.93zm0-14.07c0-.55.45-1 1-1s1 .45 1 1v2H11V2z"/>
              </svg>
              <span className="text-sm text-amber-800">
                {newCount === 1 ? "1 нове замовлення" : `${newCount} нових замовлень`}
              </span>
              <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {newCount}
              </span>
            </div>
          )}

          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNav(e, item.path)}
                    className={linkClasses(item.path, activeRoute)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.path === "/admin/orders" && newCount > 0 && !activeRoute.startsWith("/admin/orders") && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 items-center justify-center text-white text-xs font-bold">
                          {newCount}
                        </span>
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto">
          <ul className="space-y-2 border-t border-gray-200 pt-4">
            <li>
              <a
                href="/"
                onClick={(e) => handleNav(e, "/")}
                className={linkClasses("/", "")}
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
                <span>Повернутись на сайт</span>
              </a>
            </li>
            <li>
              <button
                onClick={(e) => {
                  logout();
                  handleNav(e, "/login");
                }}
                className={`${linkClasses("", "")} w-full`}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span>Вийти</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <OrderNotification
        newCount={newCount}
        show={showPopup && !activeRoute.startsWith("/admin/orders")}
        onDismiss={dismiss}
        onNavigate={handleNavigateToOrders}
      />
    </>
  );
};

export default AdminSidebar;
