import { useState, useContext, useRef, useEffect } from "react";
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  HomeOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import LoadingSpinner from "components/LoadingSpinner";
import { ShopContext } from "../context/ShopContext";
import { formatPrice } from "../utils/FormatPrice";
import { useReactToPrint } from "react-to-print";
import { setOrderAddedSuccess } from "@redux/slices/orderSlice";
import { OrderResponse } from "common/models/order";

const OrderSuccess = () => {
  const { currency, delivery_fee } = useContext(ShopContext);
  const navigate = useNavigate();
  const { loadingOrder, orderAdded } = useSelector(
    (state: RootState) => state.order
  );
  const orderRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: orderRef,
    documentTitle: "Order Confirmation",
    onAfterPrint: () => console.log("In xong rồi ✅"),
  });
  const [estimatedDelivery] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );

  const handleClick = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div ref={orderRef} className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <CheckCircleOutlined className="text-2xl text-white" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Thank you for your purchase! Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-sm overflow-hidden mb-8">
          <div className="bg-black p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Order Confirmation</h2>
                <p>
                  Order number:{" "}
                  <span className="font-mono font-bold">#{orderAdded?.id}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-sm transition-all"
                >
                  <PrinterOutlined />
                  Print
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-6">
                Order Status
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: <CheckCircleOutlined />,
                    title: "Order Placed",
                    status: "completed",
                    time: "Just now",
                  },
                  {
                    icon: <ClockCircleOutlined />,
                    title: "Processing",
                    status: "active",
                    time: "2-4 hours",
                  },
                  {
                    icon: <TruckOutlined />,
                    title: "Shipping",
                    status: "pending",
                    time: "1-2 days",
                  },
                  {
                    icon: <GiftOutlined />,
                    title: "Delivered",
                    status: "pending",
                    time: estimatedDelivery,
                  },
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`flex items-center p-4 border-2 rounded-sm ${
                        step.status === "completed"
                          ? "bg-black text-white border-black"
                          : step.status === "active"
                          ? "bg-gray-100 border-gray-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="text-xl mr-3">{step.icon}</div>
                      <div>
                        <h4 className="font-semibold text-sm">{step.title}</h4>
                        <p className="text-xs opacity-75">{step.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-4">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {orderAdded?.orderDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm"
                  >
                    <img
                      src={item.product.image.split(",")[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-sm object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-black text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">
                        {formatPrice(item.product.price)}
                        {currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-sm mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-black">Subtotal</span>
                <span className="text-black">
                  {formatPrice(orderAdded?.totalAmount!)}
                  {currency}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-black">Shipping</span>
                <span className="text-black font-semibold">
                  {formatPrice(delivery_fee)}
                  {currency}
                </span>
              </div>

              <hr className="border-gray-300 my-3" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">Total</span>
                <span className="text-lg font-bold text-black">
                  {formatPrice(orderAdded?.totalAmount! + delivery_fee)}
                  {currency}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-sm">
                <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                  <TruckOutlined />
                  Shipping Address
                </h4>
                <div className="text-left text-gray-700 truncate max-w-[240px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {orderAdded?.address.split("//")[0]}
                    </span>
                    <span className="text-gray-500 text-xs line-clamp-1">
                      {orderAdded?.address.split("//")[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-sm">
                <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                  <ClockCircleOutlined />
                  Estimated Delivery
                </h4>
                <p className="font-semibold text-black">{estimatedDelivery}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Tracking info will be sent via email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button
              onClick={() => handleClick("/collection")}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-semibold hover:bg-gray-800 transition-all"
            >
              <ShoppingOutlined />
              {loadingOrder ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                "Continue Shopping"
              )}
            </button>
            <button
              onClick={() => handleClick("/")}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-sm font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <HomeOutlined />
              {loadingOrder ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                "Back to Home"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
