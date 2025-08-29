import { OrderResponse } from "common/models/order";
import React, { useState, useEffect, useContext } from "react";
import { formatAddressPart } from "../utils/FormatAddressPart";
import { formatDate } from "../utils/FormatDate";
import { OrderStatus } from "common/enums/OrderStatus";
import { formatPrice } from "../utils/FormatPrice";
import { ShopContext } from "../context/ShopContext";
import { PaymentType } from "common/enums/PaymentType";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CreditCardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

interface Props {
  open: boolean;
  onClose: () => void;
  order?: OrderResponse | null;
  onFeedbackSubmit?: (
    orderId: number,
    feedback: { text: string; rating: number; images: File[] }
  ) => void;
}

const statusStyles: Record<OrderStatus, string> = {
  "": "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  DELIVERED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-700",
  CANCELED: "bg-red-100 text-red-700",
};

const paymentTypeStyles: Record<
  PaymentType,
  { bg: string; text: string; icon: any }
> = {
  NONE: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "🏦",
  },
  BANK: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <CreditCardOutlined className="text-lg text-blue-600" />,
  },
  CASH: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <DollarOutlined className="text-lg text-green-600" />,
  },
};

const OrderDetailModal: React.FC<Props> = ({
  open,
  onClose,
  order,
  onFeedbackSubmit,
}) => {
  const { currency } = useContext(ShopContext);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);

  // Lock scroll background
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !order) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (
      (feedback.trim() || rating > 0 || images.length > 0) &&
      onFeedbackSubmit
    ) {
      onFeedbackSubmit(order.id, { text: feedback.trim(), rating, images });
      setFeedback("");
      setRating(0);
      setImages([]);
      onClose();
    }
  };

  const paymentStyle = paymentTypeStyles[order.paymentHistory.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl z-10 flex flex-col max-h-[90vh] animate-scaleIn">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(order.createdDate)} •{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[order.status]
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* content scrollable */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* shipping + payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping Address */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Shipping address</p>
              <div className="bg-gray-50 rounded-lg p-3 border border-opacity-20 flex items-center">
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-lg text-gray-600" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 text-sm line-clamp-1">
                      {order?.address.split("//")[0]}
                    </span>
                    <span className="text-gray-500 text-xs line-clamp-1">
                      {order?.address.split("//")[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method & Status */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Payment method</p>
              <div
                className={`${paymentStyle.bg} rounded-lg p-3 border border-opacity-20`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {paymentStyle.icon}
                    <div className="flex flex-col ml-1">
                      <span
                        className={`font-medium text-sm ${paymentStyle.text}`}
                      >
                        {order.paymentHistory.type === PaymentType.BANK
                          ? "Bank Transfer"
                          : "Cash Payment"}
                      </span>
                      <div
                        className="text-xs text-gray-600
                "
                      >
                        {order.paymentHistory.type === PaymentType.BANK
                          ? "Electronic payment"
                          : "Pay on delivery"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {order.paymentHistory.status === "PAID" ? (
                      <CheckCircleFilled className="text-green-600" />
                    ) : (
                      <CloseCircleFilled className="text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        order.paymentHistory.status === "PAID"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {order.paymentHistory.status === "PAID"
                        ? "Paid"
                        : "Unpaid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* items */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-3">
              {order.orderDetails.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-4 border rounded-lg p-3"
                >
                  <img
                    src={
                      it.product.image.split(",")[0] ||
                      "/images/product-placeholder.png"
                    }
                    alt={it.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {it.product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {it.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatPrice(it.totalPrice)}
                    {currency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* total */}
          <div className="flex justify-end pt-3 border-t">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-semibold">
                {formatPrice(order.totalAmount)}
                {currency}
              </div>
            </div>
          </div>

          {/* Feedback (only if delivered) */}
          {order.status.toLowerCase() === "delivered" && (
            <div className="pt-4 border-t space-y-4">
              <h4 className="text-base font-medium text-gray-700">
                Leave your feedback
              </h4>

              {/* rating */}
              <div className="flex space-x-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* text feedback */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Write your feedback here..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-black/40"
              />

              {/* image upload */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Upload images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm"
                />
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {images.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={
                    !feedback.trim() && rating === 0 && images.length === 0
                  }
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  Submit feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* animation keyframes */}
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;
