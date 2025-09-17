import { useState } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  InboxOutlined,
  CarOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  FilterOutlined,
  ClearOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ProductHistoryModal } from "components/admin/product/ProductHistoryModal";
import { DailyHistoryModal } from "components/admin/product/DailyHistoryModal";
import { DatePicker, Dropdown, Menu, Pagination, Select } from "antd";
import { OrderStatus } from "common/enums/OrderStatus";
import { StatCard } from "components/admin/StatCard";
import { ProductForm } from "components/admin/product/ProductFormModal";
import { MultiProductImportModal } from "components/admin/product/MultiImportModal";

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
  existingImages?: string[];
  newFiles?: File[];
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

const initialProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    price: 1450,
    stock: 0,
    status: "active",
    image: "/api/placeholder/100/100",
    description: "Latest iPhone with titanium design",
    supplier: "Apple Inc.",
    minStock: 10,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    category: "Fashion",
    price: 120,
    stock: 58,
    status: "active",
    image: "/api/placeholder/100/100",
    description: "Comfortable running shoes",
    supplier: "Nike Vietnam",
    minStock: 20,
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    name: "MacBook Pro M3",
    category: "Electronics",
    price: 2499,
    stock: 8,
    status: "active",
    image: "/api/placeholder/100/100",
    description: "Professional laptop with M3 chip",
    supplier: "Apple Inc.",
    minStock: 5,
    createdAt: "2024-03-05",
  },
  {
    id: 4,
    name: "MacBook Pro M3",
    category: "Electronics",
    price: 2499,
    stock: 8,
    status: "active",
    image: "/api/placeholder/100/100",
    description: "Professional laptop with M3 chip",
    supplier: "Apple Inc.",
    minStock: 5,
    createdAt: "2024-03-05",
  },
  {
    id: 5,
    name: "MacBook Pro M3",
    category: "Electronics",
    price: 2499,
    stock: 8,
    status: "active",
    image: "/api/placeholder/100/100",
    description: "Professional laptop with M3 chip",
    supplier: "Apple Inc.",
    minStock: 5,
    createdAt: "2024-03-05",
  },
];

const importHistory: ImportHistory[] = [
  {
    id: 1,
    productId: 1,
    date: "2025-09-01",
    quantity: 10,
    unitPrice: 1400,
    totalCost: 14000,
    supplier: "Apple Inc.",
    invoiceNumber: "AP-2025-001",
    warehouse: "Kho Hồ Chí Minh",
    importedBy: "Nguyễn Văn A",
    status: "completed",
    batchNumber: "BATCH-001",
    notes: "Hàng chính hãng, bảo hành 12 tháng",
  },
  {
    id: 2,
    productId: 1,
    date: "2025-09-05",
    quantity: 5,
    unitPrice: 1420,
    totalCost: 7100,
    supplier: "Apple Inc.",
    invoiceNumber: "AP-2025-002",
    warehouse: "Kho Hà Nội",
    importedBy: "Trần Thị B",
    status: "completed",
    batchNumber: "BATCH-002",
  },
  {
    id: 3,
    productId: 2,
    date: "2025-09-02",
    quantity: 20,
    unitPrice: 100,
    totalCost: 2000,
    supplier: "Nike Vietnam",
    invoiceNumber: "NK-2025-001",
    warehouse: "Kho Hồ Chí Minh",
    importedBy: "Lê Văn C",
    status: "completed",
    batchNumber: "BATCH-003",
  },
  {
    id: 4,
    productId: 3,
    date: "2025-09-08",
    quantity: 3,
    unitPrice: 2400,
    totalCost: 7200,
    supplier: "Apple Inc.",
    invoiceNumber: "AP-2025-003",
    warehouse: "Kho Đà Nẵng",
    importedBy: "Phạm Thị D",
    status: "pending",
    batchNumber: "BATCH-004",
  },
  {
    id: 5,
    productId: 1,
    date: "2025-09-01",
    quantity: 10,
    unitPrice: 1400,
    totalCost: 14000,
    supplier: "Apple Inc.",
    invoiceNumber: "AP-2025-001",
    warehouse: "Kho Hồ Chí Minh",
    importedBy: "Nguyễn Văn A",
    status: "completed",
    batchNumber: "BATCH-001",
    notes: "Hàng chính hãng, bảo hành 12 tháng",
  },
];

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Pending", value: "PENDING" },
  { label: "Canceled", value: "CANCELED" },
];

export default function ProductManagement(): JSX.Element {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Product | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<Product | null>(
    null
  );
  const [showDailyHistory, setShowDailyHistory] = useState(false);
  const [showAddImportModal, setShowAddImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ImportHistory | null>(null);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0)
      return {
        label: "Out of stock",
        color: "text-red-600 bg-red-50",
        icon: ExclamationCircleOutlined,
      };
    if (stock <= minStock)
      return {
        label: "Low stock",
        color: "text-yellow-600 bg-yellow-50",
        icon: ExclamationCircleOutlined,
      };
    return {
      label: "In stock",
      color: "text-green-600 bg-green-50",
      icon: CheckCircleOutlined,
    };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus(OrderStatus.ALL);
    setDateFrom(null);
  };

  const hasActiveFilters = searchTerm || selectedStatus;

  const [processingStatus, setProcessingStatus] = useState<
    Record<number, boolean>
  >({});
  const handleStatusUpdate = async (
    historyId: number,
    newStatus: "completed" | "pending" | "cancelled"
  ) => {
    setProcessingStatus((prev) => ({ ...prev, [historyId]: true }));

    // Simulate API call
    setTimeout(() => {
      setProcessingStatus((prev) => ({ ...prev, [historyId]: false }));

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Product Management
              </h1>
              <p className="text-gray-500">
                Manage products and track detailed import history
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDailyHistory(true)}
                className="flex items-center gap-2 px-4 py-2 border border-black bg-black hover:bg-white hover:text-black text-white rounded-sm transition-colors duration-300"
              >
                <HistoryOutlined />
                Daily history
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
              >
                <PlusOutlined />
                Add new product
              </button>
              <button
                onClick={() => setShowAddImportModal(!showAddImportModal)}
                className="flex items-center gap-2 px-4 py-2 border border-black bg-white hover:bg-black hover:text-white text-black rounded-sm transition-colors duration-300"
              >
                <InboxOutlined />
                Add stock
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
                placeholder="Search product..."
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Products"
              value="8"
              icon={InboxOutlined}
              isProduct={true}
            />
            <StatCard
              title="Total Stock"
              value="106"
              icon={BarChartOutlined}
              isProduct={true}
            />
            <StatCard
              title="Low Stock"
              value="0"
              icon={ExclamationCircleOutlined}
              isProduct={true}
            />
            <StatCard
              title="Total Inventory Value"
              value="$126,912"
              icon={DollarOutlined}
              isProduct={true}
            />
          </div>
          <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-sm overflow-hidden text-left">
                {/* Header */}
                <thead className="bg-black sticky top-0 z-10">
                  <tr className="text-white text-sm">
                    <th className="px-6 py-4 font-semibold text-center">
                      Product
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Category
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Price
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Stock
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Supplier
                    </th>
                    <th className="px-2 py-4 font-semibold text-center"></th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-200 text-sm">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(
                      product.stock,
                      product.minStock
                    );
                    const StockIcon = stockStatus.icon;
                    const menu = (
                      <Menu>
                        <Menu.Item
                          key="history"
                          icon={<HistoryOutlined />}
                          onClick={() => setShowHistoryModal(product)}
                        >
                          History
                        </Menu.Item>
                        <Menu.Item
                          key="edit"
                          icon={<EditOutlined />}
                          onClick={() => setShowEditModal(product)}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => {
                            if (confirm(`Delete product "${product.name}"?`)) {
                              setProducts(
                                products.filter((p) => p.id !== product.id)
                              );
                            }
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    );

                    return (
                      <tr
                        key={product.id}
                        className="bg-white even:bg-gray-50 hover:shadow-md hover:ring-1 hover:ring-gray-200 transition-all"
                      >
                        {/* Product */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 rounded-md object-cover border"
                            />
                            <div className="min-w-[120px]">
                              <h3 className="font-semibold text-gray-800">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-center">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-center font-bold">
                          ${product.price.toLocaleString()}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4 text-center">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}
                            >
                              <StockIcon className="w-3 h-3" />
                              {stockStatus.label}
                            </span>
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold text-base">
                                {product.stock}
                              </span>
                              <p className="text-xs text-gray-400">
                                Min: {product.minStock}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === "active"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {product.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Supplier */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <CarOutlined className="w-4 h-4 text-gray-400" />
                            <span>{product.supplier}</span>
                          </div>
                        </td>

                        <td className="px-2 py-4 text-center">
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
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              defaultCurrent={1}
              total={100}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger={false}
              showLessItems
              responsive
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductForm
          onSave={(product) => {
            setProducts((prev) => [...prev, product]);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && (
        <ProductForm
          product={showEditModal}
          onSave={(product) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === product.id ? product : p))
            );
            setShowEditModal(null);
          }}
          onClose={() => setShowEditModal(null)}
        />
      )}

      {showDailyHistory && (
        <DailyHistoryModal
          products={products}
          importHistory={importHistory}
          onClose={() => setShowDailyHistory(false)}
        />
      )}

      {showHistoryModal && (
        <ProductHistoryModal
          product={showHistoryModal}
          importHistory={importHistory}
          onClose={() => setShowHistoryModal(null)}
        />
      )}

      {showAddImportModal && (
        <MultiProductImportModal
          products={products}
          onClose={() => setShowAddImportModal(!showAddImportModal)}
          onSave={() => setProducts}
        />
      )}
    </div>
  );
}
