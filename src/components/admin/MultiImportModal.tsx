import { CheckCircleOutlined, CloseOutlined, FileTextOutlined, InboxOutlined, MinusCircleOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";

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

interface ImportItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
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
];

export const MultiProductImportModal = ({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (importData: any) => void;
}) => {
  const [importItems, setImportItems] = useState<ImportHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [commonData, setCommonData] = useState({
    supplier: "",
    warehouse: "Kho Hồ Chí Minh",
    importedBy: "Admin",
    invoiceNumber: `INV-${Date.now()}`,
    batchNumber: `BATCH-${Date.now()}`,
    notes: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // const addProduct = (product: Product) => {
  //   if (!importItems.find((item) => item.productId === product.id)) {
  //     setImportItems([
  //       ...importItems,
  //       {
  //         productId: product.id,
  //         quantity: 1,
  //         unitPrice: product.price,
  //         notes: "",
  //       },
  //     ]);
  //   }
  // };

  const removeProduct = (productId: number) => {
    setImportItems(importItems.filter((item) => item.productId !== productId));
  };

  const updateItem = (
    productId: number,
    field: keyof ImportItem,
    value: any
  ) => {
    setImportItems(
      importItems.map((item) =>
        item.productId === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const totalCost = importItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalQuantity = importItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleSubmit = () => {
    if (importItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    const importData = {
      ...commonData,
      items: importItems,
      totalCost,
      totalQuantity,
      date: new Date().toISOString().split("T")[0],
    };

    onSave(importData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Multi-Product Import</h2>
            <p className="text-gray-300 mt-1">
              Import multiple products in one batch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </button>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Left Panel - Product Selection */}
          <div className="w-2/5 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingCartOutlined />
                Select Products
              </h3>
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const isSelected = importItems.some(
                    (item) => item.productId === product.id
                  );
                  return (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-black bg-black/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      // onClick={() => !isSelected && addProduct(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {product.category} • ${product.price}
                          </p>
                          <p className="text-xs text-gray-400">
                            Stock: {product.stock}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircleOutlined className="text-black text-lg" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Import Details */}
          <div className="w-3/5 flex flex-col">
            {/* Common Information */}
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileTextOutlined />
                Import Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={commonData.supplier}
                    onChange={(e) =>
                      setCommonData({ ...commonData, supplier: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse
                  </label>
                  <select
                    value={commonData.warehouse}
                    onChange={(e) =>
                      setCommonData({
                        ...commonData,
                        warehouse: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                  >
                    <option value="Kho Hồ Chí Minh">Kho Hồ Chí Minh</option>
                    <option value="Kho Hà Nội">Kho Hà Nội</option>
                    <option value="Kho Đà Nẵng">Kho Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={commonData.invoiceNumber}
                    onChange={(e) =>
                      setCommonData({
                        ...commonData,
                        invoiceNumber: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imported By
                  </label>
                  <input
                    type="text"
                    value={commonData.importedBy}
                    onChange={(e) =>
                      setCommonData({
                        ...commonData,
                        importedBy: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                  />
                </div>
              </div>
            </div>

            {/* Selected Products */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <InboxOutlined />
                  Selected Products ({importItems.length})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                {importItems.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <InboxOutlined className="text-4xl mb-2" />
                      <p>No products selected</p>
                      <p className="text-sm">
                        Select products from the left panel
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {importItems.map((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      if (!product) return null;

                      return (
                        <div
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {product.category}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeProduct(product.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <MinusCircleOutlined />
                                </button>
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Quantity
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateItem(
                                        product.id,
                                        "quantity",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Unit Price
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      updateItem(
                                        product.id,
                                        "unitPrice",
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Total
                                  </label>
                                  <div className="p-2 bg-gray-50 border border-gray-300 rounded-sm text-sm font-medium">
                                    $
                                    {(
                                      item.quantity * item.unitPrice
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary */}
              {importItems.length > 0 && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="grid grid-cols-3 gap-6 flex-1">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Items</p>
                        <p className="text-xl font-bold text-gray-800">
                          {importItems.length}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-xl font-bold text-blue-600">
                          {totalQuantity}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors"
                    >
                      Create Import Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
