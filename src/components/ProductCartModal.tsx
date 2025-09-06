import { Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { CartItem } from "common/models/order";
import { formatPrice } from "../utils/FormatPrice";
import { ShopContext } from "../context/ShopContext";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  item: CartItem;
}

export default function ProductModal({
  open,
  onClose,
  item,
}: ProductModalProps) {
  const { currency, updateCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(item.size || "");

  const handleReplace = () => {
    setShowSuccess(true);
    updateCart({ ...item, quantity: quantity, size: selectedSize });
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width="100%"
      className="max-w-[1000px] w-full"
    >
      <div className="flex flex-col md:flex-row gap-y-2">
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-[220px] sm:h-[280px] md:h-full object-cover"
          />
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-1/2 bg-white sm:p-6 md:p-12 overflow-y-auto max-h-[80vh]">
          <div className="h-full flex flex-col justify-center max-w-lg mx-auto">
            {/* Product Title */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {item.name}
              </h1>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="inline-flex items-baseline">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold">
                  {formatPrice(item.price)}
                </span>
                <span className="text-sm sm:text-lg md:text-xl font-medium text-gray-600 ml-2">
                  {currency}
                </span>
              </div>
            </div>

            {/* Size Selection */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-800 uppercase text-sm sm:text-base mb-2">
                  Size: <span className="font-bold">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size.name)}
                      className={`border px-3 py-1 sm:px-4 sm:py-2 rounded-sm border-black ${
                        selectedSize === size.name ? "bg-black text-white" : ""
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Replace Button */}
            <div className="mb-5">
              {/* Quantity Selector */}
              <div className="flex justify-between items-center gap-3">
                <div className="text-gray-800 uppercase text-sm sm:text-base">
                  Quantity:
                </div>
                <div className="flex items-center gap-1 rounded-sm p-1 border border-black">
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:text-black disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <MinusOutlined className="text-xs" />
                  </button>

                  <input
                    type="text"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (!isNaN(newQuantity) && newQuantity >= 1) {
                        setQuantity(newQuantity);
                      } else if (e.target.value === "") {
                        setQuantity(1);
                      }
                    }}
                    className="w-10 h-8 text-center text-sm font-semibold bg-transparent border-none outline-none"
                  />

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"
                  >
                    <PlusOutlined className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
            {/* Replace Button */}
            <button
              className={`w-full py-2 sm:py-3 px-4 sm:px-8 text-sm sm:text-lg rounded-sm transition-all duration-500 border border-black ${
                showSuccess
                  ? "bg-white text-black"
                  : "bg-black text-white hover:bg-white hover:text-black"
              }`}
              onClick={() => handleReplace()}
              disabled={showSuccess}
            >
              {showSuccess ? "✓ REPLACED" : "REPLACE"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
