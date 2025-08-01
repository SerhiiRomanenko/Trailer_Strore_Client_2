// src/components/admin/Dashboard.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAllOrders } from "../../redux/ordersSlice";
import StatCard from "./StatCard";
import DashboardIcon from "../icons/DashboardIcon";
import PackageIcon from "../icons/PackageIcon";
import ClipboardListIcon from "../icons/ClipboardListIcon";
import UsersIcon from "../icons/UsersIcon";

import { fetchTrailers } from "../../redux/trailerSlice";
import { fetchComponents } from "../../redux/componentSlice";
import SpinnerIcon from "../icons/SpinnerIcon";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.list);
  const orderStatus = useSelector((state: RootState) => state.orders.status);

  const trailers = useSelector((state: RootState) => state.trailers.list);
  const trailerStatus = useSelector(
    (state: RootState) => state.trailers.status
  );
  const components = useSelector((state: RootState) => state.components.list);
  const componentStatus = useSelector(
    (state: RootState) => state.components.status
  );

  const { users, fetchUsers, loading: authLoading } = useAuth();

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchAllOrders());
    }
    if (!authLoading && users.length === 0) {
      fetchUsers();
    }

    if (trailerStatus === "idle") {
      dispatch(fetchTrailers());
    }
    if (componentStatus === "idle") {
      dispatch(fetchComponents());
    }
  }, [
    dispatch,
    fetchUsers,
    orderStatus,
    authLoading,
    users.length,
    trailerStatus,
    componentStatus,
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) => (order.status !== "Cancelled" ? sum + order.total : sum),
    0
  );
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = trailers.length + components.length;

  if (
    orderStatus === "loading" ||
    authLoading ||
    trailerStatus === "loading" ||
    componentStatus === "loading"
  ) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">
          Завантаження даних панелі...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Панель керування
      </h1>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <StatCard
          title="Загальний дохід"
          value={`${totalRevenue.toLocaleString("uk-UA")} UAH`}
          icon={DashboardIcon}
          color="amber"
        />
        <StatCard
          title="Замовлення"
          value={totalOrders.toString()}
          icon={ClipboardListIcon}
          color="blue"
        />
        <StatCard
          title="Користувачі"
          value={totalUsers.toString()}
          icon={UsersIcon}
          color="green"
        />
        <StatCard
          title="Товари"
          value={totalProducts.toString()}
          icon={PackageIcon}
          color="purple"
        />
      </div>
    </div>
  );
};

export default Dashboard;
