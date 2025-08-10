// src/pages/AdminPage.tsx
import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers";
import AdminAccessories from "../components/admin/AdminAccessories";
import AdminComponentForm from "../components/admin/AdminComponentForm";

// Іконка для бургер-меню
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

interface AdminPageProps {
  route: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ route }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    if (route === "/admin/trailer/new") {
      return <AdminProductForm productType="Причепи" />;
    }
    if (route.startsWith("/admin/trailer/edit/")) {
      const productId = route.split("/")[4];
      return <AdminProductForm productId={productId} productType="Причепи" />;
    }
    if (route === "/admin/accessories/new") {
      return <AdminComponentForm />;
    }
    if (route.startsWith("/admin/accessories/edit/")) {
      const componentId = route.split("/")[4];
      return <AdminComponentForm componentId={componentId} />;
    }

    if (route === "/admin/orders") {
      return <AdminOrders />;
    }

    switch (route) {
      case "/admin/products":
        return <AdminProducts />;
      case "/admin/accessories":
        return <AdminAccessories />;
      case "/admin/users":
        return <AdminUsers />;
      case "/admin":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar
        activeRoute={route}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="md:hidden sticky top-0 bg-white p-4 flex items-center border-b border-gray-200 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 bg-white rounded-md shadow-md mr-4"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Панель керування</h1>
        </div>
        <div className="p-6 lg:p-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
