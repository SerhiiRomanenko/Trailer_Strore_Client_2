import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAllOrders } from "../../redux/ordersSlice";
import { fetchTrailers } from "../../redux/trailerSlice";
import { fetchComponents } from "../../redux/componentSlice";
import StatCard from "./StatCard";
import DashboardIcon from "../icons/DashboardIcon";
import PackageIcon from "../icons/PackageIcon";
import ClipboardListIcon from "../icons/ClipboardListIcon";
import UsersIcon from "../icons/UsersIcon";
import WrenchScrewdriverIcon from "../icons/WrenchScrewdriverIcon";
import SpinnerIcon from "../icons/SpinnerIcon";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const statusLabels: Record<string, string> = {
  Processing: "Очікування",
  Accepted: "Прийнято",
  Shipped: "В дорозі",
  Delivered: "Доставлено",
  Cancelled: "Скасовано",
};

const pieColors = ["#f59e0b", "#6366f1", "#3b82f6", "#10b981", "#ef4444"];
const statusOrder = ["Processing", "Accepted", "Shipped", "Delivered", "Cancelled"];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.list);
  const orderStatus = useSelector((state: RootState) => state.orders.status);
  const trailers = useSelector((state: RootState) => state.trailers.list);
  const trailerStatus = useSelector((state: RootState) => state.trailers.status);
  const components = useSelector((state: RootState) => state.components.list);
  const componentStatus = useSelector((state: RootState) => state.components.status);
  const { users, fetchUsers, loading: authLoading } = useAuth();

  useEffect(() => {
    dispatch(fetchAllOrders());
    if (!authLoading && users.length === 0) fetchUsers();
    dispatch(fetchTrailers());
    dispatch(fetchComponents());
  }, [dispatch, fetchUsers, authLoading, users.length]);

  // --- Computed stats ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => (o.status !== "Cancelled" ? s + o.total : s), 0);
    const totalOrders = orders.length;

    // Net revenue: delivered orders only (realized revenue)
    const netRevenue = orders.reduce((s, o) => (o.status === "Delivered" ? s + o.total : s), 0);

    // Pending revenue: processing + accepted + shipped (potential)
    const pendingRevenue = orders.reduce(
      (s, o) => ["Processing", "Accepted", "Shipped"].includes(o.status) ? s + o.total : s, 0
    );

    // Avg order value
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");
    const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;

    // Status counts
    const statusCounts: Record<string, number> = {};
    for (const s of statusOrder) statusCounts[s] = 0;
    for (const o of orders) statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;

    // Conversion: delivered / total non-cancelled
    const conversionRate =
      activeOrders.length > 0 ? Math.round((statusCounts.Delivered / activeOrders.length) * 100) : 0;

    // Items sold
    const itemsSold = orders
      .filter((o) => o.status === "Delivered")
      .reduce((s, o) => s + o.items.reduce((is, item) => is + item.quantity, 0), 0);

    return {
      totalRevenue,
      netRevenue,
      pendingRevenue,
      totalOrders,
      avgOrderValue,
      statusCounts,
      conversionRate,
      itemsSold,
    };
  }, [orders]);

  // --- Revenue by month (area chart) ---
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, 0);
    }
    for (const o of orders) {
      if (o.status === "Cancelled") continue;
      const d = new Date(o.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + o.total);
    }
    const monthNames = ["Січ", "Лют", "Бер", "Квіт", "Трав", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Груд"];
    return [...map.entries()].map(([key, value]) => {
      const [, m] = key.split("-");
      return { name: monthNames[parseInt(m, 10) - 1], value };
    });
  }, [orders]);

  // --- Orders by status (pie chart) ---
  const statusPieData = useMemo(() => {
    return statusOrder.map((s) => ({
      name: statusLabels[s] || s,
      value: stats.statusCounts[s] || 0,
    }));
  }, [stats.statusCounts]);

  // --- Top products ---
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of orders) {
      if (o.status === "Cancelled") continue;
      for (const item of o.items) {
        const existing = productMap.get(item.id) || { name: item.name, qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += item.price * item.quantity;
        productMap.set(item.id, existing);
      }
    }
    return [...productMap.entries()]
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(([, data]) => data);
  }, [orders]);

  // --- Daily orders (bar chart, last 14 days) ---
  const dailyData = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, 0);
    }
    for (const o of orders) {
      const key = new Date(o.date).toISOString().slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()].map(([key, count]) => ({
      name: `${key.slice(8)}.${key.slice(5, 7)}`,
      count,
    }));
  }, [orders]);

  // --- Recent orders ---
  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [orders]
  );

  const isLoading =
    orderStatus === "loading" ||
    authLoading ||
    trailerStatus === "loading" ||
    componentStatus === "loading";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500 animate-spin" />
        <p className="ml-3 text-lg text-slate-700">Завантаження даних панелі...</p>
      </div>
    );
  }

  const fmt = (n: number) => n.toLocaleString("uk-UA");

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Панель керування</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard title="Загальний дохід" value={`${fmt(stats.totalRevenue)} ₴`} icon={DashboardIcon} color="amber" />
        <StatCard title="Чистий дохід" value={`${fmt(stats.netRevenue)} ₴`} icon={ClipboardListIcon} color="green" />
        <StatCard title="Середній чек" value={`${fmt(Math.round(stats.avgOrderValue))} ₴`} icon={PackageIcon} color="blue" />
        <StatCard title="Замовлень" value={stats.totalOrders.toString()} icon={ClipboardListIcon} color="purple" />
        <StatCard title="Клієнтів" value={users.length.toString()} icon={UsersIcon} color="teal" />
        <StatCard title="Конверсія" value={`${stats.conversionRate}%`} icon={DashboardIcon} color="green" />
        <StatCard title="Продано товарів" value={stats.itemsSold.toString()} icon={PackageIcon} color="blue" />
        <StatCard title="Товарів у каталозі" value={(trailers.length + components.length).toString()} icon={WrenchScrewdriverIcon} color="amber" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue by month */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Дохід за місяцями</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${fmt(Number(v))} ₴`, "Дохід"]} />
              <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Статуси замовлень</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {statusPieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Замовлення за днями (14 днів)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Топ-5 товарів</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Ще немає даних</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.qty} шт.</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 flex-shrink-0">{fmt(p.revenue)} ₴</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Останні замовлення</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Дата</th>
                <th className="px-6 py-3 font-semibold">Клієнт</th>
                <th className="px-6 py-3 font-semibold">Сума</th>
                <th className="px-6 py-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Замовлень поки немає
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusBg: Record<string, string> = {
                    Processing: "bg-amber-100 text-amber-800",
                    Accepted: "bg-indigo-100 text-indigo-800",
                    Shipped: "bg-blue-100 text-blue-800",
                    Delivered: "bg-emerald-100 text-emerald-800",
                    Cancelled: "bg-red-100 text-red-800",
                  };
                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-3">
                        {new Date(order.date).toLocaleDateString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3">{order.customer?.name || "—"}</td>
                      <td className="px-6 py-3 font-semibold">{fmt(order.total)} ₴</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[order.status] || ""}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
