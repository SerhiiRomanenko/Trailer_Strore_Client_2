// src/pages/AdminPage.tsx
import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers";
import AdminUserForm from "../components/admin/AdminUserForm";
import AdminAccessories from "../components/admin/AdminAccessories";
import AdminComponentForm from "../components/admin/AdminComponentForm";

interface AdminPageProps {
  route: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ route }) => {
  console.log("AdminPage: Current route prop:", route);

  const renderContent = () => {
    console.log("AdminPage renderContent: Evaluating route:", route);

    if (route === "/admin/trailer/new") {
      console.log("AdminPage: Rendering AdminProductForm (New Trailer)");
      return <AdminProductForm productType="Причепи" />;
    }
    if (route.startsWith("/admin/trailer/edit/")) {
      const productId = route.split("/")[4];
      console.log(
        "AdminPage: Rendering AdminProductForm (Edit Trailer), ID:",
        productId
      );
      return <AdminProductForm productId={productId} productType="Причепи" />;
    }

    if (route === "/admin/accessories/new") {
      console.log("AdminPage: Rendering AdminComponentForm (New Component)");
      return <AdminComponentForm />;
    }
    if (route.startsWith("/admin/accessories/edit/")) {
      const componentId = route.split("/")[4];
      console.log(
        "AdminPage: Rendering AdminComponentForm (Edit Component), ID:",
        componentId
      );
      return <AdminComponentForm componentId={componentId} />;
    }

    if (route.startsWith("/admin/user/edit/")) {
      const userId = route.split("/")[4];
      console.log(
        "AdminPage: Rendering AdminUserForm (Edit User), ID:",
        userId
      );
      return <AdminUserForm userId={userId} />;
    }
    if (route === "/admin/user/new") {
      console.log("AdminPage: Rendering AdminUserForm (New User)");
      return <AdminUserForm />;
    }

    if (route === "/admin/orders") {
      console.log(
        "AdminPage: Matched orders list route. Rendering AdminOrders."
      );
      return <AdminOrders />;
    }

    switch (route) {
      case "/admin/products":
        console.log("AdminPage: Rendering AdminProducts (Trailers List)");
        return <AdminProducts />;
      case "/admin/accessories":
        console.log("AdminPage: Rendering AdminAccessories (Components List)");
        return <AdminAccessories />;
      case "/admin/users":
        console.log("AdminPage: Rendering AdminUsers (Users List)");
        return <AdminUsers />;
      case "/admin":
      default:
        console.log("AdminPage: Rendering Dashboard (Default)");
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeRoute={route} />
      <div className="flex-1 p-6 lg:p-10">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
