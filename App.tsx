import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ComponentList from "./components/ComponentList";
import ComponentDetailPage from "./pages/ComponentDetailPage";
import ContactsPage from "./pages/ContactsPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import DeliveryAndPaymentPage from "./pages/DeliveryAndPaymentPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./components/admin/AdminLayout";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyProfilePage from "./pages/MyProfilePage";
import { AppDispatch } from "./redux/store";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FilterUIProvider } from "./contexts/FilterContext";

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("locationchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("locationchange", handleLocationChange);
    };
  }, []);

  const renderPage = () => {
    const adminRoutes = [
      "/admin", "/admin/trailer/new", "/admin/trailer/edit/",
      "/admin/accessories/new", "/admin/accessories/edit/",
      "/admin/user/edit/", "/admin/user/new", "/admin/orders",
      "/admin/products", "/admin/accessories", "/admin/users",
    ];

    if (adminRoutes.some((r) => route === r || route.startsWith(r))) {
      return (
        <AdminLayout>
          <AdminPage route={route} />
        </AdminLayout>
      );
    }

    if (route.startsWith("/order-confirmation/")) {
      const orderId = route.split("/")[2];
      return <OrderConfirmationPage orderId={orderId} />;
    }

    if (route.startsWith("/product/")) {
      const slug = route.split("/")[2];
      return <ProductDetailPage slug={slug} />;
    }

    if (route.startsWith("/details/")) {
      const componentId = route.split("/")[2];
      return <ComponentDetailPage id={componentId} />;
    }

    switch (route) {
      case "/login":
        return <LoginPage />;
      case "/register":
        return <RegisterPage />;
      case "/cart":
        return <CartPage />;
      case "/favorites":
        return <FavoritesPage />;
      case "/details":
        return <ComponentList />;
      case "/contacts":
        return <ContactsPage />;
      case "/delivery-and-payment":
        return <DeliveryAndPaymentPage />;
      case "/checkout":
        return <CheckoutPage />;
      case "/my-orders":
        return <MyOrdersPage />;
      case "/my-profile":
        return <MyProfilePage />;
      case "/":
      default:
        return <HomePage />;
    }
  };

  const isAuthPage = route === "/login" || route === "/register";
  const isAdminPage = route.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      {!isAdminPage && <Header route={route} />}
      <main
        id="main-content"
        className={`flex-grow ${
          !isAdminPage ? "container mx-auto px-4 md:px-6" : ""
        } ${isAuthPage ? "flex items-center justify-center min-h-[calc(100vh-120px)]" : ""}`}
      >
        {renderPage()}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <FilterUIProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </FilterUIProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
