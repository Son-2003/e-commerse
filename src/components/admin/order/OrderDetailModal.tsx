import {
  CloseOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { OrderStatus } from "common/enums/OrderStatus";
import { Dispatch, SetStateAction } from "react";

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

const currency = (v: number) => `$${v.toLocaleString()}`;

const statusConfig = {
  [OrderStatus.ALL]: {
    color: "bg-blue-100 text-blue-700",
    icon: <CalendarOutlined className="w-4 h-4" />,
    label: "Pending",
  },
  [OrderStatus.PENDING]: {
    color: "bg-blue-100 text-blue-700",
    icon: <CalendarOutlined className="w-4 h-4" />,
    label: "Pending",
  },
  [OrderStatus.DELIVERED]: {
    color: "bg-yellow-100 text-yellow-700",
    icon: <TruckOutlined className="w-4 h-4" />,
    label: "Delivered",
  },
  [OrderStatus.COMPLETED]: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircleOutlined className="w-4 h-4" />,
    label: "Completed",
  },
  [OrderStatus.CANCELED]: {
    color: "bg-red-100 text-red-700",
    icon: <CloseCircleOutlined className="w-4 h-4" />,
    label: "Canceled",
  },
};

export function OrderDetailModal({
  order,
  onClose,
  setOrders,
}: {
  order: Order;
  onClose: () => void;
  setOrders: Dispatch<SetStateAction<Order[]>>;
}) {
  const changeStatus = (id: number, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const currentStatus =
    statusConfig[order.status] || statusConfig[OrderStatus.PENDING];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-black p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">{order.orderNumber}</h3>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-1">
                <UserOutlined className="w-4 h-4" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarOutlined className="w-4 h-4" />
                <span>{new Date(order.date).toLocaleDateString("en-US")}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className=" hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutlined className="p-2 text-xl" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Customer & Order Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-sm p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Customer Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserOutlined className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.customerName}</span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-3">
                    <MailOutlined className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm">
                      {order.customerEmail}
                    </span>
                  </div>
                )}
                {order.shippingAddress && (
                  <div className="flex items-start gap-3">
                    <EnvironmentOutlined className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {order.shippingAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-sm p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarOutlined className="text-black" />
                Order Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    Items ({order.items.length})
                  </span>
                  <span className="font-medium">
                    {currency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Shipping Fee</span>
                  <span className="font-medium">
                    {currency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Discount</span>
                  <span className="font-medium text-red-400">
                    -{currency(10)}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      {currency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status & Actions */}
            <div className="bg-gray-50 rounded-sm p-6 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCartOutlined className="text-gray-700" />
                Order Status
              </h4>

              <div className="space-y-4">
                {/* Current Status */}
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm border-2 ${currentStatus.color}`}
                >
                  {currentStatus.icon}
                  <span className="font-semibold">{currentStatus.label}</span>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  {order.status !== OrderStatus.COMPLETED &&
                    order.status !== OrderStatus.DELIVERED &&
                    order.status !== OrderStatus.CANCELED && (
                      <button
                        onClick={() =>
                          changeStatus(order.id, OrderStatus.DELIVERED)
                        }
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 
                       rounded-sm bg-blue-500 
                       text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] 
                       transition-all duration-200"
                      >
                        <TruckOutlined className="w-5 h-5" />
                        Mark as Shipped
                      </button>
                    )}

                  {order.status !== OrderStatus.COMPLETED &&
                    order.status !== OrderStatus.CANCELED && (
                      <button
                        onClick={() =>
                          changeStatus(order.id, OrderStatus.COMPLETED)
                        }
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 
                       rounded-sm bg-green-500
                       text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] 
                       transition-all duration-200"
                      >
                        <CheckCircleOutlined className="w-5 h-5" />
                        Mark as Completed
                      </button>
                    )}

                  {order.status !== OrderStatus.CANCELED && (
                    <button
                      onClick={() =>
                        changeStatus(order.id, OrderStatus.CANCELED)
                      }
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 
                     rounded-sm bg-red-500
                     text-white font-medium shadow hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
                    >
                      <CloseCircleOutlined className="w-5 h-5" />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingCartOutlined className="text-black" />
                Order Items ({order.items.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || "/api/placeholder/60/60"}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Product ID: {item.productId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-black rounded-full text-sm font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {currency(item.price)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">
                        {currency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          {order.note && (
            <div className="bg-gray-50 rounded-sm p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileTextOutlined className="text-black" />
                Order Notes
              </h4>
              <p className="text-black leading-relaxed">{order.note}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
