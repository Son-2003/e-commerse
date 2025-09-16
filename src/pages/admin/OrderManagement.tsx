// OrderManagementSystem.tsx
import React, { useMemo, useState } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  DownOutlined,
  RightOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

/**
 * Order Management Page (TypeScript + React)
 * - Designed to match Product page UI/UX
 * - Client-only demo: CRUD works in-memory
 */

/* -------------------- Types -------------------- */
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

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

/* -------------------- Dummy data -------------------- */
const sampleOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    date: "2025-09-09",
    customerName: "Nguyễn Văn A",
    customerEmail: "a@example.com",
    shippingAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      { id: 1, productId: 1, name: "iPhone 15 Pro Max", image: "/api/placeholder/80/80", price: 1450, quantity: 1 },
      { id: 2, productId: 3, name: "MacBook Pro M3", image: "/api/placeholder/80/80", price: 2499, quantity: 1 },
    ],
    subtotal: 3949,
    shippingFee: 20,
    discount: 0,
    total: 3969,
    status: "processing",
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
    items: [{ id: 3, productId: 2, name: "Nike Air Max 270", image: "/api/placeholder/80/80", price: 120, quantity: 2 }],
    subtotal: 240,
    shippingFee: 10,
    discount: 0,
    total: 250,
    status: "shipped",
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
      { id: 4, productId: 1, name: "iPhone 15 Pro Max", image: "/api/placeholder/80/80", price: 1450, quantity: 3 },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: "pending",
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
      { id: 4, productId: 1, name: "iPhone 15 Pro Max", image: "/api/placeholder/80/80", price: 1450, quantity: 3 },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: "pending",
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
      { id: 4, productId: 1, name: "iPhone 15 Pro Max", image: "/api/placeholder/80/80", price: 1450, quantity: 3 },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: "pending",
    note: "Thanh toán chuyển khoản",
    createdBy: "admin",
  },
  {
    id: 6,
    orderNumber: "ORD-2025-003",
    date: "2025-09-09",
    customerName: "Công ty XYZ",
    customerEmail: "orders@xyz.com",
    shippingAddress: "Kho Hà Nội - KCN Long Biên",
    items: [
      { id: 4, productId: 1, name: "iPhone 15 Pro Max", image: "/api/placeholder/80/80", price: 1450, quantity: 3 },
    ],
    subtotal: 4350,
    shippingFee: 50,
    discount: 100,
    total: 4300,
    status: "pending",
    note: "Thanh toán chuyển khoản",
    createdBy: "admin",
  },
];

/* -------------------- Helpers -------------------- */
const currency = (v: number) => `$${v.toLocaleString()}`;

/* Group orders by date helper */
const groupByDate = (orders: Order[]) => {
  const grouped = orders.reduce<Record<string, Order[]>>((acc, o) => {
    const d = o.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(o);
    return acc;
  }, {});
  return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
};

/* -------------------- Main Component -------------------- */
export default function OrderManagementSystem(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus | "today">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [showDaily, setShowDaily] = useState(false);

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

  /* -------------------- CRUD Handlers -------------------- */
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

  const changeStatus = (id: number, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  /* -------------------- Modals / Forms -------------------- */

  function OrderForm({
    initial,
    onCancel,
    onSave,
  }: {
    initial?: Partial<Order> | null;
    onCancel: () => void;
    onSave: (order: Order) => void;
  }) {
    const isEdit = !!initial?.id;
    const [form, setForm] = useState<Partial<Order>>(
      initial || {
        orderNumber: `ORD-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        customerName: "",
        customerEmail: "",
        shippingAddress: "",
        items: [],
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        total: 0,
        status: "pending" as OrderStatus,
        note: "",
      }
    );

    // simple local items editing
    const addItem = () => {
      const newItem: OrderItem = {
        id: Date.now(),
        productId: Date.now(),
        name: "Sản phẩm mới",
        price: 0,
        quantity: 1,
      };
      setForm((f) => {
        const items = [...(f.items || []), newItem];
        return { ...f, items, subtotal: calcSubtotal(items), total: calcTotal(items, f.shippingFee || 0, f.discount || 0) };
      });
    };

    const updateItem = (id: number, patch: Partial<OrderItem>) => {
      setForm((f) => {
        const items = (f.items || []).map((it) => (it.id === id ? { ...it, ...patch } : it));
        return { ...f, items, subtotal: calcSubtotal(items), total: calcTotal(items, f.shippingFee || 0, f.discount || 0) };
      });
    };

    const removeItem = (id: number) => {
      setForm((f) => {
        const items = (f.items || []).filter((it) => it.id !== id);
        return { ...f, items, subtotal: calcSubtotal(items), total: calcTotal(items, f.shippingFee || 0, f.discount || 0) };
      });
    };

    const calcSubtotal = (items: OrderItem[]) => items.reduce((s, it) => s + it.price * it.quantity, 0);
    const calcTotal = (items: OrderItem[], shipping: number, discount: number) => calcSubtotal(items) + shipping - (discount || 0);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{isEdit ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}</h3>
                <p className="text-sm text-gray-600">{form.orderNumber}</p>
              </div>
              <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded">
                <CloseOutlined />
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // build final order
              const final: Order = {
                id: (initial?.id as number) || Date.now(),
                orderNumber: form.orderNumber || `ORD-${Date.now()}`,
                date: form.date || new Date().toISOString().split("T")[0],
                customerName: form.customerName || "Khách hàng",
                customerEmail: form.customerEmail,
                shippingAddress: form.shippingAddress,
                items: form.items || [],
                subtotal: calcSubtotal(form.items || []),
                shippingFee: form.shippingFee || 0,
                discount: form.discount || 0,
                total: calcTotal(form.items || [], form.shippingFee || 0, form.discount || 0),
                status: (form.status as OrderStatus) || "pending",
                note: form.note,
                createdBy: form.createdBy || "admin",
              };
              onSave(final);
            }}
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Số đơn</label>
                  <input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Ngày</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Khách hàng</label>
                  <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Email</label>
                  <input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Địa chỉ giao hàng</label>
                <input value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Mặt hàng</h4>
                  <div className="flex gap-2">
                    <button type="button" onClick={addItem} className="px-3 py-1 bg-blue-600 text-white rounded">Thêm mặt hàng</button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(form.items || []).map((it) => (
                    <div key={it.id} className="flex gap-2 items-center border rounded p-2">
                      <img src={it.image || "/api/placeholder/60/60"} alt={it.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} className="w-full p-1 border rounded mb-1" />
                        <div className="flex gap-2">
                          <input type="number" value={it.price} onChange={(e) => updateItem(it.id, { price: Number(e.target.value) })} className="w-28 p-1 border rounded" />
                          <input type="number" value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} className="w-20 p-1 border rounded" />
                          <div className="ml-auto text-sm font-medium">{currency(it.price * it.quantity)}</div>
                          <button type="button" onClick={() => removeItem(it.id)} className="p-1 text-red-600"><DeleteOutlined /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(form.items || []).length === 0 && <p className="text-sm text-gray-400">Chưa có mặt hàng nào — thêm để tạo đơn.</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Phí vận chuyển</label>
                  <input type="number" value={form.shippingFee ?? 0} onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value), total: calcTotal(form.items || [], Number(e.target.value), form.discount || 0) })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Giảm giá</label>
                  <input type="number" value={form.discount ?? 0} onChange={(e) => setForm({ ...form, discount: Number(e.target.value), total: calcTotal(form.items || [], form.shippingFee || 0, Number(e.target.value)) })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Trạng thái</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })} className="w-full p-2 border rounded">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Subtotal: {currency(form.subtotal || 0)}</p>
                  <p className="text-sm text-gray-600">Shipping: {currency(form.shippingFee || 0)}</p>
                  <p className="text-sm text-gray-600">Discount: {currency(form.discount || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tổng</p>
                  <p className="text-2xl font-bold">{currency(form.total || 0)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t">
              <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Hủy</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{isEdit ? "Cập nhật" : "Tạo đơn"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{order.orderNumber}</h3>
              <p className="text-sm text-gray-600">{order.customerName} • {new Date(order.date).toLocaleDateString("vi-VN")}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><CloseOutlined /></button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded p-4">
                <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                <p className="text-sm"><UserOutlined /> {order.customerName}</p>
                <p className="text-sm">{order.customerEmail}</p>
                <p className="text-sm"><EnvironmentOutlined /> {order.shippingAddress}</p>
              </div>

              <div className="bg-gray-50 rounded p-4">
                <h4 className="font-semibold mb-2">Tóm tắt đơn hàng</h4>
                <p className="text-sm">Tổng mặt hàng: {order.items.length}</p>
                <p className="text-sm">Phí vận chuyển: {currency(order.shippingFee)}</p>
                <p className="text-sm">Giảm giá: {currency(order.discount || 0)}</p>
                <p className="text-lg font-bold">Tổng: {currency(order.total)}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                    order.status === "processing" ? "bg-blue-50 text-blue-700" :
                    order.status === "shipped" ? "bg-indigo-50 text-indigo-700" :
                    order.status === "delivered" ? "bg-green-50 text-green-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mặt hàng</h4>
              <div className="bg-white border rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Sản phẩm</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Số lượng</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Đơn giá</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Tổng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.items.map((it) => (
                        <tr key={it.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img src={it.image || "/api/placeholder/60/60"} alt={it.name} className="w-12 h-12 rounded object-cover" />
                            <div>
                              <div className="font-medium">{it.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{it.quantity}</td>
                          <td className="px-4 py-3">{currency(it.price)}</td>
                          <td className="px-4 py-3">{currency(it.price * it.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {order.note && (
              <div className="bg-gray-50 p-4 rounded">
                <h5 className="font-semibold">Ghi chú</h5>
                <p className="text-sm text-gray-700">{order.note}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border rounded">Đóng</button>
              {order.status !== "shipped" && order.status !== "delivered" && order.status !== "cancelled" && (
                <button onClick={() => changeStatus(order.id, "shipped")} className="px-4 py-2 bg-indigo-600 text-white rounded">Đánh dấu Shipped</button>
              )}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <button onClick={() => changeStatus(order.id, "delivered")} className="px-4 py-2 bg-green-600 text-white rounded">Đánh dấu Delivered</button>
              )}
              {order.status !== "cancelled" && (
                <button onClick={() => changeStatus(order.id, "cancelled")} className="px-4 py-2 bg-red-600 text-white rounded">Hủy</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- Daily Orders Modal -------------------- */
  function DailyOrdersModal({ onClose }: { onClose: () => void }) {
    const grouped = useMemo(() => groupByDate(orders), [orders]);
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Đơn hàng theo ngày</h3>
              <p className="text-sm text-gray-600">Tổng quan đơn hàng theo ngày</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><CloseOutlined /></button>
          </div>

          <div className="p-6 space-y-4">
            {grouped.map(([date, items]) => {
              const qty = items.reduce((s, o) => s + o.items.reduce((ss, it) => ss + it.quantity, 0), 0);
              const value = items.reduce((s, o) => s + o.total, 0);
              const isOpen = expanded === date;
              return (
                <div key={date} className="border rounded overflow-hidden">
                  <div className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer" onClick={() => setExpanded(isOpen ? null : date)}>
                    <div className="flex items-center gap-3">
                      {isOpen ? <DownOutlined /> : <RightOutlined />}
                      <div>
                        <div className="font-semibold">{new Date(date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
                        <div className="text-sm text-gray-500">{items.length} đơn hàng</div>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Số lượng</div>
                        <div className="font-bold text-blue-600">{qty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Giá trị</div>
                        <div className="font-bold text-green-600">{currency(value)}</div>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Mã đơn</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Khách hàng</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Số mặt hàng</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Tổng</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Trạng thái</th>
                              <th className="px-4 py-2 text-left text-sm font-semibold">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {items.map((o) => (
                              <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                                <td className="px-4 py-3">{o.customerName}</td>
                                <td className="px-4 py-3">{o.items.length}</td>
                                <td className="px-4 py-3 font-bold text-green-600">{currency(o.total)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-sm ${
                                    o.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                                    o.status === "processing" ? "bg-blue-50 text-blue-700" :
                                    o.status === "shipped" ? "bg-indigo-50 text-indigo-700" :
                                    o.status === "delivered" ? "bg-green-50 text-green-700" :
                                    "bg-red-50 text-red-700"
                                  }`}>{o.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <button onClick={() => setViewOrder(o)} className="p-2 bg-indigo-50 rounded text-indigo-600"><EyeOutlined /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- Render main UI -------------------- */
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
            <p className="text-gray-600">Danh sách đơn hàng, xem chi tiết và xử lý trạng thái</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowDaily(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow">
              <CalendarOutlined /> Theo dõi theo ngày
            </button>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow">
              <PlusOutlined /> Tạo đơn hàng
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto mt-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm theo mã, khách hàng, sản phẩm..." className="w-full pl-10 pr-4 py-2 border rounded" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded">
            <option value="all">Tất cả trạng thái</option>
            <option value="today">Hôm nay</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">Mã đơn</th>
                    <th className="px-6 py-4 text-sm font-semibold">Ngày</th>
                    <th className="px-6 py-4 text-sm font-semibold">Khách hàng</th>
                    <th className="px-6 py-4 text-sm font-semibold">Mặt hàng</th>
                    <th className="px-6 py-4 text-sm font-semibold">Tổng</th>
                    <th className="px-6 py-4 text-sm font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 text-sm font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                      <td className="px-6 py-4">{new Date(o.date).toLocaleDateString("vi-VN")}</td>
                      <td className="px-6 py-4">{o.customerName}</td>
                      <td className="px-6 py-4">{o.items.length}</td>
                      <td className="px-6 py-4 font-bold text-green-600">{currency(o.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          o.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          o.status === "processing" ? "bg-blue-50 text-blue-700" :
                          o.status === "shipped" ? "bg-indigo-50 text-indigo-700" :
                          o.status === "delivered" ? "bg-green-50 text-green-700" :
                          "bg-red-50 text-red-700"
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setViewOrder(o)} className="p-2 bg-indigo-50 rounded text-indigo-600" title="Xem"><EyeOutlined /></button>
                          <button onClick={() => setEditOrder(o)} className="p-2 bg-yellow-50 rounded text-yellow-600" title="Chỉnh sửa"><EditOutlined /></button>
                          <button onClick={() => { if (confirm("Xác nhận xóa?")) deleteOrder(o.id); }} className="p-2 bg-red-50 rounded text-red-600" title="Xóa"><DeleteOutlined /></button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Không có đơn hàng phù hợp.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="bg-white rounded p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded"><ShoppingCartOutlined /></div>
              </div>
            </div>

            <div className="bg-white rounded p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Đang xử lý</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "processing").length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded"><ClockCircleOutlined /></div>
              </div>
            </div>

            <div className="bg-white rounded p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Đã giao</p>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === "delivered").length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded"><CheckCircleOutlined /></div>
              </div>
            </div>

            <div className="bg-white rounded p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-purple-600">{currency(orders.reduce((s, o) => s + o.total, 0))}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded"><DollarOutlined /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <OrderForm
          onCancel={() => setShowCreateModal(false)}
          onSave={(o) => {
            createOrder(o);
            setShowCreateModal(false);
          }}
        />
      )}

      {editOrder && (
        <OrderForm
          initial={editOrder}
          onCancel={() => setEditOrder(null)}
          onSave={(o) => {
            updateOrder(o);
            setEditOrder(null);
          }}
        />
      )}

      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}

      {showDaily && <DailyOrdersModal onClose={() => setShowDaily(false)} />}
    </div>
  );
}
