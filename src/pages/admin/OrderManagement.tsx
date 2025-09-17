import { useMemo, useState } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  ClearOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { DatePicker, Dropdown, Menu, Select } from "antd";
import { OrderStatus } from "common/enums/OrderStatus";
import { StatCard } from "components/admin/StatCard";
import { formatDate } from "../../utils/FormatDate";
import { OrderFormModal } from "components/admin/order/OrderFormModal";
import { OrderDetailModal } from "components/admin/order/OrderDetailModal";
import { DailyOrdersModal } from "components/admin/order/DailyOrdersModal";

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string; // ISO date
  customerName: string;
  customerEmail?: string;
  shippingAddress?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  note?: string;
  createdBy?: string;
}

const sampleOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    date: "2025-09-09",
    customerName: "Nguyễn Văn A",
    customerEmail: "a@example.com",
    shippingAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      {
        id: 1,
        productId: 1,
        name: "iPhone 15 Pro Max",
        image: "/api/placeholder/80/80",
        price: 1450,
        quantity: 1,
      },
      {
        id: 2,
        productId: 3,
        name: "MacBook Pro M3",
        image: "/api/placeholder/80/80",
        price: 2499,
        quantity: 1,
      },
    ],
    subtotal: 3949,
    shippingFee: 20,
    discount: 0,
    total: 3969,
    status: OrderStatus.PENDING,
    note: "Giao trong giờ hành chính",
    createdBy: "admin",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    date: "2025-09-08",
    customerName: "Trần Thị B",
    customerEmail: "b@example.com",
    shippingAddress: "45 Lê Lợi, Quận 3, TP.HCM",
    items: [
      {
        id: 3,
        productId: 2,
        name: "Nike Air Max 270",
        image: "/api/placeholder/80/80",
        price: 120,
        quantity: 2,
      },
    ],
    subtotal: 240,
    shippingFee: 10,
    discount: 0,
    total: 250,
    status: OrderStatus.DELIVERED,
    note: "",
    createdBy: "sales1",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    date: "2025-09-09",
    customerName: "Công ty XYZ",
    customerEmail: "orders@xyz.com",
    shippingAddress: "Kho Hà Nội - KCN Long Biên",
    items: [
      {
        id: 4,
        productId: 1,
        name: "iPhone 15 Pro Max",
        image: "/api/placeholder/80/80",
        price: 1450,
        quantity: 3,
      },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: OrderStatus.PENDING,
    note: "Thanh toán chuyển khoản",
    createdBy: "admin",
  },
  {
    id: 4,
    orderNumber: "ORD-2025-003",
    date: "2025-09-09",
    customerName: "Công ty XYZ",
    customerEmail: "orders@xyz.com",
    shippingAddress: "Kho Hà Nội - KCN Long Biên",
    items: [
      {
        id: 4,
        productId: 1,
        name: "iPhone 15 Pro Max",
        image: "/api/placeholder/80/80",
        price: 1450,
        quantity: 3,
      },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: OrderStatus.PENDING,
    note: "Thanh toán chuyển khoản",
    createdBy: "admin",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-003",
    date: "2025-09-09",
    customerName: "Công ty XYZ",
    customerEmail: "orders@xyz.com",
    shippingAddress: "Kho Hà Nội - KCN Long Biên",
    items: [
      {
        id: 4,
        productId: 1,
        name: "iPhone 15 Pro Max",
        image: "/api/placeholder/80/80",
        price: 1450,
        quantity: 3,
      },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: OrderStatus.DELIVERED,
    note: "Thanh toán chuyển khoản",
    createdBy: "admin",
  },
];

const currency = (v: number) => `$${v.toLocaleString()}`;

export default function OrderManagementSystem(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | OrderStatus | "today"
  >("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [showDaily, setShowDaily] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Pending", value: "PENDING" },
    { label: "Canceled", value: "CANCELED" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus(OrderStatus.ALL);
    setDateFrom(null);
  };

  const hasActiveFilters = searchTerm || selectedStatus;

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter === "today") {
        const today = new Date().toISOString().slice(0, 10);
        if (o.date !== today) return false;
      } else if (statusFilter !== "all") {
        if (o.status !== statusFilter) return false;
      }

      if (!search) return true;
      const s = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        (o.customerEmail || "").toLowerCase().includes(s) ||
        o.items.some((it) => it.name.toLowerCase().includes(s))
      );
    });
  }, [orders, search, statusFilter]);

  const createOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  };

  const deleteOrder = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-gray-500">
                Order list, view details and update status
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDaily(true)}
                className="flex items-center gap-2 px-4 py-2 border border-black bg-black hover:bg-white hover:text-black text-white rounded-sm transition-colors duration-300"
              >
                <CalendarOutlined /> Track by Day
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
              >
                <PlusOutlined /> Create Order
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-sm outline-none"
              />
            </div>

            {/* Status Filter */}
            <Select
              placeholder="Filter by Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="min-w-[180px]
             [&_.ant-select-selector]:!border 
             [&_.ant-select-selector]:!border-gray-300 
             [&_.ant-select-selector]:!rounded-sm 
             [&_.ant-select-selector]:!shadow-none 
             [&_.ant-select-selector]:!outline-none"
              suffixIcon={<FilterOutlined />}
              style={{ height: 41 }}
              options={statusOptions}
            />

            {/* Date Filter */}
            <DatePicker
              value={dateFrom}
              onChange={setDateFrom}
              size="large"
              className="
    min-w-[180px] py-2 rounded-sm border border-gray-300
    [&.ant-picker-focused]:!border-gray-300
    [&.ant-picker-focused]:!shadow-none
    [&.ant-picker:hover]:!border-gray-300"
            />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center py-2 justify-center gap-2 px-4 border border-gray-300 rounded-sm"
              >
                <ClearOutlined />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Orders"
              value={orders.length}
              icon={ShoppingCartOutlined}
              isProduct={true}
            />
            <StatCard
              title="Pending"
              value={
                orders.filter((o) => o.status === OrderStatus.PENDING).length
              }
              icon={ClockCircleOutlined}
              isProduct={true}
            />
            <StatCard
              title="Completed"
              value={
                orders.filter((o) => o.status === OrderStatus.COMPLETED).length
              }
              icon={CheckCircleOutlined}
              isProduct={true}
            />
            <StatCard
              title="Total Value"
              value={currency(orders.reduce((s, o) => s + o.total, 0))}
              icon={DollarOutlined}
              isProduct={true}
            />
          </div>
          <div className="bg-white rounded-sm shadow overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-sm overflow-hidden text-left">
                <thead className="bg-black sticky top-0 z-10">
                  <tr className="text-white text-sm">
                    <th className="px-6 py-4 font-semibold text-center">
                      Order No.
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Customer
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Items
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Total
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Status
                    </th>
                    <th className="px-2 py-4 font-semibold text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filtered.map((o) => {
                    const menu = (
                      <Menu>
                        <Menu.Item
                          key="history"
                          icon={<EyeOutlined />}
                          onClick={() => setViewOrder(o)}
                        >
                          View
                        </Menu.Item>
                        <Menu.Item
                          key="edit"
                          icon={<EditOutlined />}
                          onClick={() => setEditOrder(o)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => {
                            if (confirm("Confirm delete?")) deleteOrder(o.id);
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    );
                    return (
                      <tr
                        key={o.id}
                        className="bg-white even:bg-gray-50 hover:shadow-md hover:ring-1 hover:ring-gray-200 transition-all"
                      >
                        <td className="px-6 py-4 font-medium text-center">
                          {o.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {formatDate(new Date(o.date))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {o.customerName}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm font-semibold">
                            {o.items.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-center text-green-600">
                          {currency(o.total)}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              o.status === OrderStatus.PENDING
                                ? "bg-yellow-50 text-yellow-700"
                                : o.status === OrderStatus.DELIVERED
                                ? "bg-indigo-50 text-indigo-700"
                                : o.status === OrderStatus.COMPLETED
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setViewOrder(o)}
                            className="p-2 bg-indigo-50 rounded text-indigo-600"
                            title="View"
                          >
                            <EyeOutlined />
                          </button>
                          <button
                            onClick={() => setEditOrder(o)}
                            className="p-2 bg-yellow-50 rounded text-yellow-600"
                            title="Edit"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Confirm delete?")) deleteOrder(o.id);
                            }}
                            className="p-2 bg-red-50 rounded text-red-600"
                            title="Delete"
                          >
                            <DeleteOutlined />
                          </button>
                        </div> */}
                          <Dropdown
                            overlay={menu}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                              <MoreOutlined className="text-lg text-black" />
                            </button>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No matching orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create order */}
      {showCreateModal && (
        <OrderFormModal
          onCancel={() => setShowCreateModal(false)}
          onSave={(o) => {
            createOrder(o);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Edit order */}
      {editOrder && (
        <OrderFormModal
          initial={editOrder}
          onCancel={() => setEditOrder(null)}
          onSave={(o) => {
            updateOrder(o);
            setEditOrder(null);
          }}
        />
      )}

      {/* Order detail */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <OrderDetailModal
            order={viewOrder}
            setOrders={setOrders}
            onClose={() => setViewOrder(null)}
          />
        </div>
      )}

      {/* Daily orders */}
      {showDaily && (
        <DailyOrdersModal
          setOrders={setOrders}
          orders={orders}
          onClose={() => setShowDaily(false)}
        />
      )}
    </div>
  );
}
