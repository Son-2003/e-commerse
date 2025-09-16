import {
  AimOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { StatCard } from "components/admin/StatCard";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";

const pieData = [
  { name: "Electronics", value: 35, color: "#8B5CF6" },
  { name: "Fashion", value: 28, color: "#06B6D4" },
  { name: "Home & Garden", value: 20, color: "#10B981" },
  { name: "Sports", value: 17, color: "#F59E0B" },
];

const COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
];

type Year = "2023" | "2024";

const yearlyData: Record<
  Year,
  {
    month: string;
    orders: number;
    revenue: number;
    customers: number;
    conversion: number;
  }[]
> = {
  2023: [
    { month: "Jan", orders: 50, revenue: 1200, customers: 45, conversion: 2.1 },
    { month: "Feb", orders: 80, revenue: 1600, customers: 68, conversion: 2.4 },
    { month: "Mar", orders: 65, revenue: 1400, customers: 58, conversion: 2.2 },
    { month: "Apr", orders: 90, revenue: 2000, customers: 82, conversion: 2.8 },
    {
      month: "May",
      orders: 120,
      revenue: 2600,
      customers: 105,
      conversion: 3.1,
    },
    {
      month: "Jun",
      orders: 150,
      revenue: 3100,
      customers: 138,
      conversion: 3.4,
    },
    {
      month: "Jul",
      orders: 170,
      revenue: 3400,
      customers: 155,
      conversion: 3.6,
    },
    {
      month: "Aug",
      orders: 200,
      revenue: 4200,
      customers: 180,
      conversion: 3.8,
    },
    {
      month: "Sep",
      orders: 180,
      revenue: 3900,
      customers: 165,
      conversion: 3.5,
    },
    {
      month: "Oct",
      orders: 210,
      revenue: 4600,
      customers: 195,
      conversion: 4.0,
    },
    {
      month: "Nov",
      orders: 230,
      revenue: 5000,
      customers: 218,
      conversion: 4.2,
    },
    {
      month: "Dec",
      orders: 250,
      revenue: 5500,
      customers: 238,
      conversion: 4.5,
    },
  ],
  2024: [
    { month: "Jan", orders: 70, revenue: 1600, customers: 62, conversion: 2.8 },
    {
      month: "Feb",
      orders: 100,
      revenue: 2200,
      customers: 88,
      conversion: 3.2,
    },
    { month: "Mar", orders: 85, revenue: 2000, customers: 75, conversion: 3.0 },
    {
      month: "Apr",
      orders: 120,
      revenue: 2800,
      customers: 108,
      conversion: 3.5,
    },
    {
      month: "May",
      orders: 140,
      revenue: 3200,
      customers: 128,
      conversion: 3.8,
    },
    {
      month: "Jun",
      orders: 180,
      revenue: 3800,
      customers: 165,
      conversion: 4.1,
    },
    {
      month: "Jul",
      orders: 200,
      revenue: 4300,
      customers: 185,
      conversion: 4.3,
    },
    {
      month: "Aug",
      orders: 230,
      revenue: 4900,
      customers: 212,
      conversion: 4.6,
    },
    {
      month: "Sep",
      orders: 210,
      revenue: 4600,
      customers: 198,
      conversion: 4.4,
    },
    {
      month: "Oct",
      orders: 240,
      revenue: 5200,
      customers: 225,
      conversion: 4.8,
    },
    {
      month: "Nov",
      orders: 260,
      revenue: 5700,
      customers: 248,
      conversion: 5.0,
    },
    {
      month: "Dec",
      orders: 280,
      revenue: 6200,
      customers: 268,
      conversion: 5.2,
    },
  ],
};

const performanceData = [
  { name: "Website Speed", value: 85, color: "#10B981" },
  { name: "SEO Score", value: 92, color: "#8B5CF6" },
  { name: "User Experience", value: 78, color: "#06B6D4" },
  { name: "Mobile Friendly", value: 88, color: "#F59E0B" },
];

const topProducts = [
  { name: "iPhone 15 Pro", sales: 145, revenue: 14500, trend: "up" },
  { name: 'Samsung TV 55"', sales: 98, revenue: 9800, trend: "up" },
  { name: "Nike Air Max", sales: 87, revenue: 8700, trend: "down" },
  { name: "MacBook Air", sales: 76, revenue: 15200, trend: "up" },
  { name: "PlayStation 5", sales: 65, revenue: 6500, trend: "down" },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<Year>("2023");

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="p-6 border-b bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-black">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500">
          Comprehensive overview of business metrics
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value="$42,350"
              change="+18.5%"
              icon={DollarCircleOutlined}
              trend="up"
            />
            <StatCard
              title="Active Users"
              value="2,845"
              change="+12.3%"
              icon={UserOutlined}
              trend="up"
            />
            <StatCard
              title="Total Orders"
              value="1,289"
              change="+8.7%"
              icon={ShoppingCartOutlined}
              trend="up"
            />
            <StatCard
              title="Products Sold"
              value="3,456"
              change="+9.4%"
              icon={InboxOutlined}
              trend="up"
            />
            <StatCard
              title="Customer Satisfaction"
              value="94.5%"
              change="+3.2%"
              icon={TrophyOutlined}
              trend="up"
            />
          </div>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue & Orders Trend */}
            <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Revenue & Orders Trend
                </h3>
                <select
                  value={selectedYear}
                  onChange={(e: any) => setSelectedYear(e.target.value)}
                  className="border border-gray-200 rounded-sm px-5 py-2 text-sm outline-none"
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yearlyData[selectedYear]}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#06B6D4"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-sm shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Top Selling Products
              </h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-sm bg-gray-100 hover:bg-gray-200/80 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-sm bg-black flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.sales} sales • $
                          {product.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        product.trend === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.trend === "up" ? (
                        <ArrowUpOutlined className="w-4 h-4" />
                      ) : (
                        <ArrowDownOutlined className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
