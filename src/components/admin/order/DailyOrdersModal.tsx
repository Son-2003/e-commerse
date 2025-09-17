import {
  CloseOutlined,
  DownOutlined,
  EyeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { OrderStatus } from "common/enums/OrderStatus";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { OrderDetailModal } from "./OrderDetailModal";

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

const groupByDate = (orders: Order[]) => {
  const grouped = orders.reduce<Record<string, Order[]>>((acc, o) => {
    const d = o.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(o);
    return acc;
  }, {});
  return Object.entries(grouped).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
  );
};

const currency = (v: number) => `$${v.toLocaleString()}`;

export function DailyOrdersModal({
  onClose,
  orders,
  setOrders,
}: {
  onClose: () => void;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
}) {
  const grouped = useMemo(() => groupByDate(orders), [orders]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        <div
          className={`transition-all duration-300 ${
            viewOrder
              ? "opacity-0 -translate-x-10 pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">Orders by Day</h3>
                <p className="text-sm text-gray-500">Daily order overview</p>
              </div>
              <button
                onClick={onClose}
                className=" hover:bg-gray-100 rounded-full"
              >
                <CloseOutlined className="p-2 text-xl" />
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-100">
            <div className="space-y-4">
              {grouped.map(([date, items]) => {
                const qty = items.reduce(
                  (s, o) => s + o.items.reduce((ss, it) => ss + it.quantity, 0),
                  0
                );
                const value = items.reduce((s, o) => s + o.total, 0);
                const isOpen = expanded === date;
                return (
                  <div key={date} className="border rounded overflow-hidden">
                    <div
                      className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : date)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                          {isOpen ? (
                            <DownOutlined className="text-black text-sm" />
                          ) : (
                            <RightOutlined className="text-black text-sm" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {new Date(date)
                              .toISOString()
                              .slice(0, 10)
                              .split("-")
                              .reverse()
                              .join(" - ")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {items.length} orders
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Quantity
                          </p>
                          <p className="text-lg font-bold text-black">{qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Value
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ${value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="p-4 bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-black text-white">
                              <tr>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Order ID
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Customer
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Items
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Total
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {items.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 font-medium text-center">
                                    {o.orderNumber}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {o.customerName}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {o.items.length}
                                  </td>
                                  <td className="px-4 py-3 font-bold text-green-600 text-center">
                                    {currency(o.total)}
                                  </td>
                                  <td className="px-4 py-3 text-center">
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
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        onClick={() =>
                                          setViewOrder(o)
                                        }
                                        className="rounded-sm p-2 text-black transition-colors"
                                        title="View Details"
                                      >
                                        <EyeOutlined className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300" />
                                      </button>
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

        {/* Order detail */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            viewOrder
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10 pointer-events-none"
          }`}
        >
          {viewOrder && (
            <OrderDetailModal
              order={viewOrder}
              setOrders={setOrders}
              onClose={() => setViewOrder(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
