import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import SpinnerIcon from "../icons/SpinnerIcon";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon className="h-10 w-10 text-amber-500" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    if (window.location.pathname !== "/") {
      window.history.replaceState({}, "", "/");
      window.dispatchEvent(new Event("locationchange"));
    }
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Доступ заборонено</h1>
          <p className="text-gray-600 mt-2">
            У вас немає прав для перегляду цієї сторінки.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminLayout;
