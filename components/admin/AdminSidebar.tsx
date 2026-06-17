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

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const linkClasses = (path: string, currentRoute: string) => {
    const base =
      "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200";
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
            className="p-2 text-gray-600"
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
                    <span>{item.label}</span>
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
    </>
  );
};

export default AdminSidebar;
