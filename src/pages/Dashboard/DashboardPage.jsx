// src/pages/Dashboard/DashboardPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  fetchInvoices,
  fetchInvoiceStats,
  selectDashboardStats,
  selectAllInvoices,
} from "../../Redux/Slice/InvoiceSlice/InvoiceSlice";
import StatusBadge from "../../pages/Dashboard/StatusBadge";
import { formatCurrency, formatDate } from "../../utils/helpers";

const StatCard = ({ label, value, icon: Icon, iconBg }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon size={18} className="text-gray-700" />
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Build monthly chart data from invoices
const buildChartData = (invoices) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    const monthInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt || inv.dueDate);
      return (
        invDate.getMonth() === d.getMonth() && invDate.getFullYear() === year
      );
    });

    const income = monthInvoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.total || 0), 0);

    const expenses = monthInvoices
      .filter((i) => i.status === "unpaid" || i.status === "pending")
      .reduce((sum, i) => sum + (i.total || 0), 0);

    data.push({
      month,
      Income: income,
      Expenses: expenses,
    });
  }
  return data;
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const invoices = useSelector(selectAllInvoices);
  const { loading } = useSelector((s) => s.invoices);

  useEffect(() => {
    // Fetch both invoices and stats
    dispatch(fetchInvoices());
    dispatch(fetchInvoiceStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchInvoices());
    dispatch(fetchInvoiceStats());
  };

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const chartData = buildChartData(invoices);

  // Calculate stats from invoices directly if stats object is empty
  const totalInvoices = stats.totalInvoices || invoices.length || 0;
  const totalPaid =
    stats.totalPaid ||
    invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPending =
    stats.totalPending ||
    invoices
      .filter((inv) => inv.status === "unpaid" || inv.status === "pending")
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalVAT =
    stats.totalVAT ||
    invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.vatAmount || 0), 0);

  const STAT_CARDS = [
    {
      label: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
      iconBg: "bg-gray-100",
    },
    {
      label: "Amount Paid",
      value: formatCurrency(totalPaid),
      icon: CheckCircle,
      iconBg: "bg-[#C8F000]/20",
    },
    {
      label: "Pending Payment",
      value: formatCurrency(totalPending),
      icon: Clock,
      iconBg: "bg-orange-50",
    },
    {
      label: "VAT Collected",
      value: formatCurrency(totalVAT),
      icon: TrendingUp,
      iconBg: "bg-blue-50",
    },
  ];

  // Find max value for chart Y-axis
  const maxChartValue = Math.max(
    ...chartData.map((d) => Math.max(d.Income, d.Expenses)),
    1000,
  );

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with your business today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Working Capital</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            Last 6 months
          </span>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length > 0 &&
          chartData.some((d) => d.Income > 0 || d.Expenses > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D7A4F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2D7A4F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8F000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8F000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                domain={[0, maxChartValue]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(value) => (
                  <span className="text-gray-600">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="Income"
                name="Income"
                stroke="#2D7A4F"
                strokeWidth={2}
                fill="url(#colorIncome)"
                dot={{ fill: "#2D7A4F", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                name="Expenses"
                stroke="#C8F000"
                strokeWidth={2}
                fill="url(#colorExpenses)"
                dot={{ fill: "#C8F000", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="mb-3 opacity-20" />
            <p className="text-sm">No data available for the chart</p>
            <p className="text-xs mt-1">
              Create invoices to see your working capital
            </p>
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Invoices</h2>
          <Link
            to="/dashboard/invoices"
            className="text-sm text-[#2D7A4F] font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentInvoices.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No invoices yet</p>
            <p className="text-xs mt-1">
              Create your first invoice to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name/Client
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-gray-800">
                          {inv.clientName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {inv.clientEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {formatDate(inv.dueDate || inv.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 text-right">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
