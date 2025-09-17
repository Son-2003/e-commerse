import {
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { OrderStatus } from "common/enums/OrderStatus";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  category?: string;
  stock?: number;
}

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
  date: string;
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

// Mock products data - replace with your actual products
const mockProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 999,
    image: "/api/placeholder/80/80",
    category: "Electronics",
    stock: 10,
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: 899,
    image: "/api/placeholder/80/80",
    category: "Electronics",
    stock: 15,
  },
  {
    id: 3,
    name: "MacBook Air M2",
    price: 1299,
    image: "/api/placeholder/80/80",
    category: "Laptops",
    stock: 8,
  },
  {
    id: 4,
    name: "iPad Pro",
    price: 799,
    image: "/api/placeholder/80/80",
    category: "Tablets",
    stock: 12,
  },
  {
    id: 5,
    name: "AirPods Pro",
    price: 249,
    image: "/api/placeholder/80/80",
    category: "Audio",
    stock: 20,
  },
  {
    id: 6,
    name: "Apple Watch",
    price: 399,
    image: "/api/placeholder/80/80",
    category: "Wearables",
    stock: 18,
  },
];

const currency = (v: number) => `$${v.toLocaleString()}`;

export function OrderFormModal({
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
      status: "PENDING" as OrderStatus,
      note: "",
    }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products
  const categories = ["all", ...new Set(mockProducts.map((p) => p.category))];
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addProductToOrder = (product: Product) => {
    const existingItem = form.items?.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      updateItem(existingItem.id, { quantity: existingItem.quantity + 1 });
    } else {
      const newItem: OrderItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      };
      setForm((f) => {
        const items = [...(f.items || []), newItem];
        return {
          ...f,
          items,
          subtotal: calcSubtotal(items),
          total: calcTotal(items, f.shippingFee || 0, f.discount || 0),
        };
      });
    }
  };

  const updateItem = (id: number, patch: Partial<OrderItem>) => {
    setForm((f) => {
      const items = (f.items || []).map((it) =>
        it.id === id ? { ...it, ...patch } : it
      );
      return {
        ...f,
        items,
        subtotal: calcSubtotal(items),
        total: calcTotal(items, f.shippingFee || 0, f.discount || 0),
      };
    });
  };

  const removeItem = (id: number) => {
    setForm((f) => {
      const items = (f.items || []).filter((it) => it.id !== id);
      return {
        ...f,
        items,
        subtotal: calcSubtotal(items),
        total: calcTotal(items, f.shippingFee || 0, f.discount || 0),
      };
    });
  };

  const calcSubtotal = (items: OrderItem[]) =>
    items.reduce((s, it) => s + it.price * it.quantity, 0);
  const calcTotal = (items: OrderItem[], shipping: number, discount: number) =>
    calcSubtotal(items) + shipping - (discount || 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">
              {isEdit ? "Edit Order" : "Create New Order"}
            </h3>
            <p className="text-gray-300 mt-1">
              Import multiple products in one batch
            </p>
          </div>
          <button
            onClick={onCancel}
            className="hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutlined className="text-xl p-2" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Product Selection */}
          <div className="w-2/5 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingCartOutlined />
                Select Products
              </h3>
              {/* Search */}
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-sm p-3 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  onClick={() => addProductToOrder(product)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || "/api/placeholder/60/60"}
                      alt={product.name}
                      className="w-16 h-16 rounded-md object-cover bg-black"
                    />
                    <div className="flex-1">
                      <div className="justify-between flex">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {product.name}
                        </h4>
                        <PlusOutlined className="text-black" />
                      </div>

                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-semibold text-black">
                          {currency(product.price)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No products found
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Order Information */}
          <div className="flex-1 flex flex-col bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const final: Order = {
                  id: (initial?.id as number) || Date.now(),
                  orderNumber: form.orderNumber || `ORD-${Date.now()}`,
                  date: form.date || new Date().toISOString().split("T")[0],
                  customerName: form.customerName || "Customer",
                  customerEmail: form.customerEmail,
                  shippingAddress: form.shippingAddress,
                  items: form.items || [],
                  subtotal: calcSubtotal(form.items || []),
                  shippingFee: form.shippingFee || 0,
                  discount: form.discount || 0,
                  total: calcTotal(
                    form.items || [],
                    form.shippingFee || 0,
                    form.discount || 0
                  ),
                  status: (form.status as OrderStatus) || OrderStatus.PENDING,
                  note: form.note,
                  createdBy: form.createdBy || "admin",
                };
                onSave(final);
              }}
              className="flex-1 flex overflow-y-auto flex-col"
            >
              <div className="flex-1 p-6 space-y-4 text-black">
                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-3 text-xl">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        value={form.customerName}
                        onChange={(e) =>
                          setForm({ ...form, customerName: e.target.value })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Email
                      </label>
                      <input
                        value={form.customerEmail}
                        onChange={(e) =>
                          setForm({ ...form, customerEmail: e.target.value })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Phone
                      </label>
                      <input
                        value={form.customerEmail}
                        onChange={(e) =>
                          setForm({ ...form, customerEmail: e.target.value })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                        placeholder="+99999999999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Address
                      </label>
                      <input
                        value={form.shippingAddress}
                        onChange={(e) =>
                          setForm({ ...form, shippingAddress: e.target.value })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                        placeholder="Full shipping address"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Items */}
                <div>
                  <h4 className="font-semibold mb-3 mt-5">
                    Selected Items ({form.items?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(form.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-center border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-sm p-3 bg-white text-black"
                      >
                        <img
                          src={item.image || "/api/placeholder/50/50"}
                          alt={item.name}
                          className="w-16 h-16 rounded-md object-cover bg-black"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {currency(item.price)} x {item.quantity} ={" "}
                            {currency(item.price * item.quantity)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, {
                                quantity: Math.max(1, Number(e.target.value)),
                              })
                            }
                            className="w-16 p-1 bg-white border border-gray-200 rounded text-center text-black outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className=" text-red-400 hover:bg-red-200 rounded-full transition-colors"
                          >
                            <DeleteOutlined className="p-2" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(form.items || []).length === 0 && (
                      <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-sm">
                        No products selected
                        <br />
                        Choose products from the left panel
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Settings */}
                <div>
                  <h4 className="font-semibold mb-3 text-black mt-5">
                    Order Settings
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Shipping Fee
                      </label>
                      <input
                        type="number"
                        value={form.shippingFee ?? 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            shippingFee: Number(e.target.value),
                            total: calcTotal(
                              form.items || [],
                              Number(e.target.value),
                              form.discount || 0
                            ),
                          })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Discount
                      </label>
                      <input
                        type="number"
                        value={form.discount ?? 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            discount: Number(e.target.value),
                            total: calcTotal(
                              form.items || [],
                              form.shippingFee || 0,
                              Number(e.target.value)
                            ),
                          })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="border border-gray-300 rounded-sm py-3 px-2 w-full outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-500 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={form.note || ""}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
                      rows={2}
                      placeholder="Additional notes for this order..."
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary & Actions */}
              <div className="border-t p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* Left - Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-black">
                        {currency(calcSubtotal(form.items || []))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span className="font-medium text-black">
                        {currency(form.shippingFee || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Discount</span>
                      <span className="font-medium text-red-500">
                        -{currency(form.discount || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Right - Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-3xl font-bold text-black">
                      {currency(
                        calcTotal(
                          form.items || [],
                          form.shippingFee || 0,
                          form.discount || 0
                        )
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 border border-black bg-black hover:bg-white hover:text-black text-white rounded-sm transition-colors duration-300"
                  >
                    {isEdit ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
