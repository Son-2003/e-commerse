import {
  ArrowUpOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { StatCard } from "./StatCard";
import { useState } from "react";
import { ImportHistoryDetail } from "./ImportHistoryDetail";

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

export const ProductHistoryModal: React.FC<{
  product: Product;
  importHistory: ImportHistory[];
  onClose: () => void;
}> = ({ product, onClose, importHistory }) => {
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ImportHistory | null>(null);
  const productHistory = importHistory.filter(
    (h) => h.productId === product.id
  );
  const totalImported = productHistory.reduce((sum, h) => sum + h.quantity, 0);
  const totalValue = productHistory.reduce((sum, h) => sum + h.totalCost, 0);
  const avgPrice = totalImported ? totalValue / totalImported : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
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
                <h2 className="text-2xl font-bold text-gray-800">
                  Import History
                </h2>
                <p className="text-gray-600">{product.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-sm"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Imported"
                value={totalImported}
                icon={InboxOutlined}
                isProduct={true}
              />
              <StatCard
                title="Total Value"
                value={`$${totalValue.toLocaleString()}`}
                icon={DollarOutlined}
                isProduct={true}
              />
              <StatCard
                title="Average Price"
                value={`$${avgPrice.toFixed(0)}`}
                icon={ArrowUpOutlined}
                isProduct={true}
              />
              <StatCard
                title="Import Count"
                value={productHistory.length}
                icon={FileTextOutlined}
                isProduct={true}
              />
            </div>
          </div>

          <div className="p-6 bg-gray-100">
            <div className="bg-white rounded-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        #
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Import Date
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Total Cost
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productHistory.map((history, index) => {
                      const StatusIcon =
                        history.status === "completed"
                          ? CheckCircleOutlined
                          : history.status === "pending"
                          ? ClockCircleOutlined
                          : ExclamationCircleOutlined;
                      const statusColor =
                        history.status === "completed"
                          ? "text-green-600 bg-green-50"
                          : history.status === "pending"
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-red-600 bg-red-50";

                      return (
                        <tr
                          key={history.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-center">{index + 1}</td>

                          <td className="px-4 py-4 flex justify-center items-center gap-2">
                            <CalendarOutlined className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                              {new Date(history.date).toLocaleDateString(
                                "en-US"
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">
                              {history.quantity}
                            </span>
                          </td>

                          <td className="px-4 py-4 font-medium text-center">
                            ${history.unitPrice.toLocaleString()}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="font-bold text-green-600">
                              ${history.totalCost.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <CarOutlined className="w-4 h-4 text-gray-400" />
                              <span>{history.supplier}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {history.status === "completed"
                                ? "Completed"
                                : history.status === "pending"
                                ? "Pending"
                                : "Cancelled"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedHistoryItem(history)}
                                className="bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
                                title="View Details"
                              >
                                <EyeOutlined className="p-1.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
              product={product}
              onClose={() => setSelectedHistoryItem(null)}
              onUpdateStatus={() => setSelectedHistoryItem(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
