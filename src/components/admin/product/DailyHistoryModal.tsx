import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DollarOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  InboxOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { StatCard } from "../StatCard";
import { ImportHistoryDetail } from "./ImportHistoryDetail";

interface ImportHistory {
  id: number;
  productId: number;
  date: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  invoiceNumber: string;
  warehouse: string;
  importedBy: string;
  notes?: string;
  status: "completed" | "pending" | "cancelled";
  batchNumber?: string;
  expiryDate?: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image: string;
  description?: string;
  supplier?: string;
  minStock: number;
  createdAt: string;
}

export const DailyHistoryModal: React.FC<{
  onClose: () => void;
  importHistory: ImportHistory[];
  products: Product[];
}> = ({ onClose, importHistory, products }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ImportHistory | null>(null);

  const groupedHistory = useMemo(() => {
    const grouped = importHistory.reduce(
      (acc: Record<string, ImportHistory[]>, item) => {
        const date = item.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      },
      {}
    );
    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [importHistory]);

  const getTotalByDate = (items: ImportHistory[]) => {
    return {
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      value: items.reduce((sum, item) => sum + item.totalCost, 0),
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* List UI */}
        <div
          className={`transition-all duration-300 ${
            selectedHistoryItem
              ? "opacity-0 -translate-x-10 pointer-events-none"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Daily Import History
                </h2>
                <p className="text-gray-500">
                  Overview of daily import activities
                </p>
              </div>
              <button
                onClick={onClose}
                className=" hover:bg-gray-100 rounded-full"
              >
                <CloseOutlined className="p-2 text-xl"/>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Orders Import"
                value="4"
                icon={FileTextOutlined}
                isProduct={true}
              />
              <StatCard
                title="Total Products Import"
                value="38"
                icon={InboxOutlined}
                isProduct={true}
              />
              <StatCard
                title="Total Value"
                value="$38K"
                icon={DollarOutlined}
                isProduct={true}
              />
              <StatCard
                title="Active Import Days"
                value="4"
                icon={CalendarOutlined}
                isProduct={true}
              />
            </div>
          </div>

          <div className="p-6 bg-gray-100">
            {/* Daily Import List */}
            <div className="space-y-4">
              {groupedHistory.map(([date, items]) => {
                const { quantity, value } = getTotalByDate(items);
                const isExpanded = expandedDate === date;

                return (
                  <div
                    key={date}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div
                      className="bg-white p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setExpandedDate(isExpanded ? null : date)}
                    >
                      <div className="flex justify-between items-center">
                        {/* Left: Date & Orders */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                            {isExpanded ? (
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
                              {items.length} import orders
                            </p>
                          </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              Quantity
                            </p>
                            <p className="text-lg font-bold text-black">
                              {quantity}
                            </p>
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
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-white">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-black text-white">
                              <tr>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Product
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Quantity
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Unit Price
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Total
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Supplier
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Imported By
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-center text-sm font-semibold"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {items.map((item) => {
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                const StatusIcon =
                                  item.status === "completed"
                                    ? CheckCircleOutlined
                                    : item.status === "pending"
                                    ? ClockCircleOutlined
                                    : ExclamationCircleOutlined;
                                const statusColor =
                                  item.status === "completed"
                                    ? "text-green-600 bg-green-50"
                                    : item.status === "pending"
                                    ? "text-yellow-600 bg-yellow-50"
                                    : "text-red-600 bg-red-50";

                                return (
                                  <tr
                                    key={item.id}
                                    className="hover:bg-gray-50"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-center gap-3">
                                        <img
                                          src={product?.image}
                                          alt=""
                                          className="w-10 h-10 rounded-sm object-cover"
                                        />
                                        <div>
                                          <p className="font-medium text-black">
                                            {product?.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {product?.category}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="bg-gray-200 text-black px-2 py-1 rounded-full text-sm font-semibold">
                                        {item.quantity}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-center">
                                      ${item.unitPrice.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="font-bold text-green-600">
                                        ${item.totalCost.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center gap-2">
                                        <CarOutlined className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">
                                          {item.supplier}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center gap-2">
                                        <UserOutlined className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">
                                          {item.importedBy}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                                      >
                                        <StatusIcon className="w-3 h-3" />
                                        {item.status === "completed"
                                          ? "Completed"
                                          : item.status === "pending"
                                          ? "Pending"
                                          : "Cancelled"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button
                                        onClick={() =>
                                          setSelectedHistoryItem(item)
                                        }
                                        className="rounded-sm p-2 text-black transition-colors"
                                        title="View Details"
                                      >
                                        <EyeOutlined className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
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

        {/* Detail UI */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            selectedHistoryItem
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10 pointer-events-none"
          }`}
        >
          {selectedHistoryItem && (
            <ImportHistoryDetail
              history={selectedHistoryItem}
              product={
                products.find((p) => p.id === selectedHistoryItem.productId)!
              }
              onClose={() => setSelectedHistoryItem(null)}
              onUpdateStatus={() => setSelectedHistoryItem(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
