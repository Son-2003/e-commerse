import {
  CameraOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Switch } from "antd";
import { useCallback, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory?: string;
  isBestSeller?: boolean;
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

const MAX_IMAGES_TOTAL = 3;
const CLOUDINARY_FOLDER = "E-commerce/product";

export const ProductForm: React.FC<{
  product?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      ...(formData as Product),
      id: product?.id || Date.now(),
      createdAt: product?.createdAt || new Date().toISOString().split("T")[0],
    };
    onSave(newProduct);
  };

  const removeExistingImage = useCallback(
    (imageIndex: number): void => {
      if (!formData) return;

      if (formData.existingImages) {
        const newExistingImages = formData.existingImages.filter(
          (_, index) => index !== imageIndex
        );
        setFormData((prev) =>
          prev ? { ...prev, existingImages: newExistingImages } : null
        );
      }
    },
    [formData]
  );

  const removeNewFile = useCallback(
    (fileIndex: number): void => {
      if (!formData) return;

      if (formData.newFiles) {
        const newFiles = formData.newFiles.filter(
          (_, index) => index !== fileIndex
        );
        setFormData((prev) => (prev ? { ...prev, newFiles } : null));
      }
    },
    [formData]
  );

  const handleNewImageUpload = useCallback(
    (files: FileList): void => {
      if (!formData) return;

      const filesArray = Array.from(files);
      if (formData.existingImages && formData.newFiles) {
        const currentTotal =
          formData.existingImages.length + formData.newFiles.length;

        if (currentTotal + filesArray.length > MAX_IMAGES_TOTAL) {
          alert(
            `You can only have a maximum of ${MAX_IMAGES_TOTAL} images total!`
          );
          return;
        }

        const newFiles = [...formData.newFiles, ...filesArray].slice(
          0,
          MAX_IMAGES_TOTAL - formData.existingImages.length
        );

        setFormData((prev) => (prev ? { ...prev, newFiles } : null));
      }
    },
    [formData]
  );

  const totalImages =
    formData?.existingImages?.length! + formData?.newFiles?.length!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className=" hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseOutlined className="p-2 text-xl"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Images */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-black">
              Product Photos
            </label>

            <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
              {/* Upload Area */}
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-3 w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200">
                  <PlusCircleOutlined className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleNewImageUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-3 w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200">
                  <PlusCircleOutlined className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleNewImageUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-3 w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200">
                  <PlusCircleOutlined className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleNewImageUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-3 w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-100 transition-all duration-200">
                  <PlusCircleOutlined className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleNewImageUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {totalImages === 0 && !isEditing && (
              <div className="text-center py-8 text-gray-500">
                <CameraOutlined className="text-4xl text-gray-300 mb-2" />
                <p>No photos uploaded yet</p>
              </div>
            )}
          </div>

          {/* Product basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    name: e.target.value,
                  })
                }
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              />
            </div>
            {/* Supplier */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={formData?.supplier ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    supplier: e.target.value,
                  })
                }
                placeholder="Supplier name"
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Category
              </label>
              <select
                value={formData?.category || ""}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    category: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            {/* Subcategory */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Subcategory
              </label>
              <select
                value={formData?.category || ""}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    category: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              >
                <option value="">Select sub category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          {/* Price & stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData?.price ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    price: Number(e.target.value),
                  })
                }
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData?.stock ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    stock: Number(e.target.value),
                  })
                }
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Min Stock
              </label>
              <input
                type="number"
                value={formData?.minStock ?? 0}
                onChange={(e) =>
                  setFormData({
                    ...(formData as Product),
                    minStock: Number(e.target.value),
                  })
                }
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-sm outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Description
            </label>
            <textarea
              value={formData?.description ?? ""}
              onChange={(e) =>
                setFormData({
                  ...(formData as Product),
                  description: e.target.value,
                })
              }
              placeholder="Write product description..."
              className="w-full p-3 border border-gray-300 rounded-sm outline-none min-h-36"
              rows={3}
            />
          </div>

          {/* Status & Bestseller */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Status
              </label>
              <div className="flex gap-2">
                <select
                  value={formData?.status ?? "active"}
                  onChange={(e) =>
                    setFormData({
                      ...(formData as Product),
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-1/2 p-3 border border-gray-300 rounded-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="w-1/2 flex items-center p-3 justify-between border border-gray-300 rounded-sm">
                  <span className="text-sm font-semibold text-gray-700">
                    Best Seller
                  </span>
                  <Switch className="text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-black rounded-sm text-black hover:bg-black hover:text-white transition-colors duration-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-sm border border-black hover:bg-white hover:text-black transition-colors duration-100"
            >
              {product ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
