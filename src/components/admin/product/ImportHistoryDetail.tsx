import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  InboxOutlined,
  LoadingOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { StatCard } from "../StatCard";

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

// Import History Detail Modal
export const ImportHistoryDetail = ({
  history,
  product,
  onClose,
  onUpdateStatus,
}: {
  history: ImportHistory;
  product: Product;
  onClose: () => void;
  onUpdateStatus: (
    historyId: number,
    newStatus: "completed" | "pending" | "cancelled"
  ) => void;
}) => {
  const [processingStatus, setProcessingStatus] = useState(false);

  const statusConfig = {
    completed: {
      color: "text-green-600 bg-green-50",
      icon: CheckCircleOutlined,
      label: "Completed",
    },
    pending: {
      color: "text-yellow-600 bg-yellow-50",
      icon: ClockCircleOutlined,
      label: "Pending",
    },
    cancelled: {
      color: "text-red-600 bg-red-50",
      icon: ExclamationCircleOutlined,
      label: "Cancelled",
    },
  };
  const status = statusConfig[history.status];
  const StatusIcon = status.icon;

  const handleStatusUpdate = async (
    newStatus: "completed" | "pending" | "cancelled"
  ) => {
    setProcessingStatus(true);

    // Simulate API call
    setTimeout(() => {
      onUpdateStatus(history.id, newStatus);
      setProcessingStatus(false);

      const statusText =
        newStatus === "completed"
          ? "completed"
          : newStatus === "pending"
          ? "set to pending"
          : "cancelled";
      alert(`Import order has been ${statusText} successfully!`);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Import Detail</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-300">Invoice:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {history.invoiceNumber}
              </span>
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

      {/* Product Info */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-lg object-cover shadow-md"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600">
                {product.category} • {product.supplier}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${status.color}`}
              >
                <StatusIcon />
                {status.label}
              </span>
            </div>
          </div>
          {/* Quick Status Actions */}
          <div className="flex flex-wrap gap-3">
            {history.status !== "completed" && (
              <button
                onClick={() => handleStatusUpdate("completed")}
                disabled={processingStatus}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium
                 bg-green-600 text-white shadow-sm hover:bg-green-700
                 focus:outline-none focus:ring-2 focus:ring-green-400
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
              >
                {processingStatus ? <LoadingOutlined /> : <CheckOutlined />}
                Completed
              </button>
            )}

            {history.status !== "pending" && (
              <button
                onClick={() => handleStatusUpdate("pending")}
                disabled={processingStatus}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium
                 bg-yellow-500 text-white shadow-sm hover:bg-yellow-600
                 focus:outline-none focus:ring-2 focus:ring-yellow-300
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
              >
                {processingStatus ? (
                  <LoadingOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
                Set Pending
              </button>
            )}

            {history.status !== "cancelled" && (
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={processingStatus}
                className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium
                 bg-red-600 text-white shadow-sm hover:bg-red-700
                 focus:outline-none focus:ring-2 focus:ring-red-400
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
              >
                {processingStatus ? <LoadingOutlined /> : <StopOutlined />}
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Import Details */}
      <div className="flex-1 auto p-6">
        <div className="bg-white border rounded-lg p-6 space-y-6 shadow-sm">
          {/* Import Information */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileTextOutlined />
              Import Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-medium">{history.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Import Date:</span>
                <span className="font-medium">
                  {new Date(history.date).toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warehouse:</span>
                <span className="font-medium">{history.warehouse}</span>
              </div>
            </div>
          </div>

          {/* Import Personnel */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <UserOutlined />
              Import Personnel
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Imported By:</span>
                <span className="font-medium">{history.importedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{history.supplier}</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <InboxOutlined />
              Product Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold">{history.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-medium">
                  ${history.unitPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-semibold">Total Cost:</span>
                <span className="font-bold text-xl text-green-600">
                  ${history.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {history.notes && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Notes</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {history.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
