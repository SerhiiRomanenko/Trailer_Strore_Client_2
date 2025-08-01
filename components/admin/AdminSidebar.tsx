import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import DashboardIcon from "../icons/DashboardIcon";
import PackageIcon from "../icons/PackageIcon";
import ClipboardListIcon from "../icons/ClipboardListIcon";
import UsersIcon from "../icons/UsersIcon";
import ArrowUturnLeftIcon from "../icons/ArrowUturnLeftIcon";
import ArrowLeftOnRectangleIcon from "../icons/ArrowLeftOnRectangleIcon";
import WrenchScrewdriverIcon from "../icons/WrenchScrewdriverIcon";

interface AdminSidebarProps {
  activeRoute: string;
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

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeRoute }) => {
  const { logout } = useAuth();

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
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
    <aside className="w-64 bg-white h-screen sticky top-0 border-r border-gray-200 p-4 flex flex-col">
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-8 px-2">
          <a href="/admin" onClick={(e) => handleNav(e, "/admin")}>
            Admin Panel
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
  );
};

export default AdminSidebar;
