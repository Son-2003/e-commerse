import { useContext, useEffect, useState } from "react";
import Title from "../../components/customer/Title";
import { ShopContext } from "../../context/ShopContext";
import {
  BankOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  DollarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import {
  formatPhone,
  isValidEmail,
  isValidPhone,
  unFormatPhone,
} from "../../utils/FormatPhone";
import { fetchAddressSuggestions } from "../../utils/GoongLocation";
import { addOrderThunk } from "@redux/thunk/orderThunk";
import LoadingSpinner from "components/LoadingSpinner";
import { PaymentType } from "common/enums/PaymentType";
import { Suggestion } from "common/models/location";
import { formatAddressPart } from "../../utils/FormatAddressPart";
import { createPaymentLinkThunk } from "@redux/thunk/paymentThunk";
import { setOrderAddedSuccess } from "@redux/slices/orderSlice";
import { CartItem, OrderResponse } from "common/models/order";
import { formatPrice } from "../../utils/FormatPrice";
import CartTotal from "components/customer/CartTotal";

const PlaceOrder = () => {
  const { cartItems, cartItemBuyNow, clearCart, currency } =
    useContext(ShopContext);
  const [method, setMethod] = useState<PaymentType>(PaymentType.NONE);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { navigate } = useContext(ShopContext);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { loadingOrder } = useSelector((state: RootState) => state.order);
  const { loadingPayment } = useSelector((state: RootState) => state.payment);
  const [addressSelected, setAddressSelected] = useState<Suggestion | null>(
    null
  );
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    if (userInfo) {
      setForm({
        fullname: userInfo.fullName ?? "",
        phone: userInfo.phone ?? "",
        address: formatAddressPart(userInfo.address) ?? "",
        email: userInfo.email ?? "",
      });
    }
  }, [userInfo]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm({ ...form, phone: formatPhone(value) });
    } else if (name === "address") {
      setForm({ ...form, address: value });

      if (value.length > 2) {
        try {
          const results = await fetchAddressSuggestions(value);
          setSuggestions(results || []);
        } catch (err) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        cartItems: cartItemBuyNow.length > 0 ? cartItemBuyNow : cartItems,
        address: addressSelected
          ? (addressSelected?.structured_formatting?.main_text ?? "") +
            "//" +
            (addressSelected?.structured_formatting?.secondary_text ?? "")
          : userInfo?.address!,
        fullName: form.fullname,
        email: form.email,
        phone: unFormatPhone(form.phone),
        type: method,
      };

      // Tạo order trước (cho cả CASH và BANK)
      const orderRes = await dispatch(addOrderThunk(orderData)).unwrap();

      if (method === PaymentType.CASH) {
        clearCart();
        localStorage.removeItem("cart");
        navigate("/success");
      } else if (method === PaymentType.BANK) {
        localStorage.setItem("pendingOrder", JSON.stringify(orderRes));

        const result = await dispatch(
          createPaymentLinkThunk({
            cartItems: cartItemBuyNow.length > 0 ? cartItemBuyNow : cartItems,
            orderCode: orderRes.orderCode,
            returnUrl: window.location.origin + "/place-order",
            cancelUrl: window.location.origin + "/place-order",
          })
        ).unwrap();

        if (result) {
          window.location.href = result.checkoutUrl;
        }
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const queryParams = new URLSearchParams(location.search);
      const status = queryParams.get("status");
      const code = queryParams.get("code");

      if (status === "PAID" && code === "00") {
        try {
          const pendingOrderData = localStorage.getItem("pendingOrder");

          if (pendingOrderData) {
            const parsedOrder: OrderResponse = JSON.parse(pendingOrderData);

            dispatch(setOrderAddedSuccess(parsedOrder));
            clearCart();
            localStorage.removeItem("cart");
            localStorage.removeItem("pendingOrder");
            navigate("/success");
          }
        } catch (error) {
          console.error("Failed to create order:", error);
          navigate("/place-order");
        }
      } else if (
        status === "CANCELLED" ||
        queryParams.get("cancel") === "true"
      ) {
        navigate("/place-order");
      }
    };

    handlePaymentReturn();
  }, []);

  const isValid =
    !form.address?.toString().length ||
    !form.fullname?.length ||
    !form.phone?.length ||
    !form.email.length ||
    !isValidPhone(form.phone) ||
    method === PaymentType.NONE;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Left Side */}
      <div className="sm:w-1/2 bg-white rounded-2xl p-6 space-y-4">
        <div className="text-xl sm:text-2xl font-semibold text-gray-800">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Full name</label>
          <div className="relative">
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
              type="text"
              placeholder="Full name"
            />
            {form.fullname?.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {!form.fullname?.length ? (
                  <CloseCircleFilled className="text-red-600" />
                ) : (
                  <CheckCircleFilled className="text-green-600" />
                )}
              </span>
            )}
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <input
              name="email"
              onChange={handleChange}
              value={form.email}
              className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
              type="email"
              placeholder="Email address"
            />
            {form.email?.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {!form.email?.length || !isValidEmail(form.email) ? (
                  <CloseCircleFilled className="text-red-600" />
                ) : (
                  <CheckCircleFilled className="text-green-600" />
                )}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1">Address</label>
          <div className="relative">
            <input
              name="address"
              onChange={handleChange}
              value={form.address}
              className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
              type="text"
              placeholder="Address"
            />
            {form.address?.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {!form.address.length ? (
                  <CloseCircleFilled className="text-red-600" />
                ) : (
                  <CheckCircleFilled className="text-green-600" />
                )}
              </span>
            )}
          </div>
          {form.address?.length > 2 && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 z-50 bg-white border rounded-lg shadow mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setForm({
                      ...form,
                      address:
                        (item.structured_formatting?.main_text ?? "") +
                        ", " +
                        (item.structured_formatting?.secondary_text ?? ""),
                    });
                    setAddressSelected(item);
                    setSuggestions([]);
                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-3 transition-colors"
                >
                  <EnvironmentOutlined className="text-black mt-1" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {item.structured_formatting?.main_text ??
                        item.description}
                    </span>
                    <span className="text-gray-500 text-xs line-clamp-1">
                      {item.structured_formatting?.secondary_text ?? ""}
                    </span>
                  </div>
                </li>
              ))}

              <li
                onClick={() => {
                  setForm({ ...form, address: form.address });
                  setSuggestions([]);
                }}
                className="px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-sm text-blue-700 font-medium flex flex-col gap-1 rounded-b-sm"
              >
                <div className="items-center">
                  <div className="flex gap-2">
                    <PlusOutlined />
                    <span>Use the address you entered:</span>
                  </div>

                  <span className="italic break-words whitespace-normal">
                    {form.address}
                  </span>
                </div>
              </li>
            </ul>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <div className="relative">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-sm py-3 px-4 w-full outline-none"
              type="text"
              placeholder="Phone"
            />
            {form.phone?.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {!isValidPhone(form.phone) ? (
                  <CloseCircleFilled className="text-red-600" />
                ) : (
                  <CheckCircleFilled className="text-green-600" />
                )}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-sm pt-6">
          <div className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            <Title text1="PAYMENT" text2="METHOD" />
          </div>

          <div className="flex flex-col gap-4">
            {/* BANK */}
            <div
              onClick={() => setMethod(PaymentType.BANK)}
              className={`flex items-center gap-3 border rounded-sm p-4 cursor-pointer transition ${
                method === PaymentType.BANK
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  method === PaymentType.BANK
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              />
              <BankOutlined className="text-xl text-gray-700" />
              <p className="text-gray-700 font-medium ml-2">Bank Transfer</p>
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod(PaymentType.CASH)}
              className={`flex items-center gap-3 border rounded-sm p-4 cursor-pointer transition ${
                method === PaymentType.CASH
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  method === PaymentType.CASH
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              />
              <DollarOutlined className="text-xl text-gray-700" />
              <p className="text-gray-700 font-medium ml-2">Cash on Delivery</p>
            </div>
          </div>
        </div>

        <div className="w-full text-start">
          <button
            disabled={loadingOrder || isValid || loadingPayment}
            onClick={() => handlePlaceOrder()}
            className={`bg-black text-white w-full px-10 py-3 rounded-sm font-medium text-sm shadow-md hover:opacity-90 transition
            ${isValid ? "bg-gray-500" : "bg-black hover:opacity-90"}`}
          >
            {loadingOrder || loadingPayment ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              "PLACE ORDER"
            )}
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="sm:w-1/2 flex flex-col gap-6">
        <div className="space-y-4">
          {cartItemBuyNow.length > 0
            ? cartItemBuyNow.map((item: CartItem, index: number) => (
                <div
                  key={`${index}`}
                  className="group relative rounded-sm bg-white border"
                >
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative group/image">
                          <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-sm overflow-hidden transition-all duration-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <button className="absolute -top-2 -right-2 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-white bg-black">
                            {item.quantity}
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 items-center">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          {/* Left Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Product Name */}
                            <h3 className="font-semibold text-black leading-tight line-clamp-2 hover:text-gray-500 transition-colors cursor-pointer">
                              {item.name}
                            </h3>

                            {/* Price & Size */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-1">
                                <TagOutlined className="text-gray-500 text-sm" />
                                <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium border border-gray-200">
                                  Size {item.size}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Controls */}
                          <div className="flex flex-col lg:items-end gap-4">
                            {/* Subtotal */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-black">
                                {formatPrice(item.price * item.quantity)}
                                {currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : cartItems.map((item: CartItem, index: number) => (
                <div
                  key={`${index}`}
                  className="group relative rounded-sm bg-white border"
                >
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="relative group/image">
                          <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-sm overflow-hidden transition-all duration-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <button className="absolute -top-2 -right-2 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-white bg-black">
                            {item.quantity}
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 items-center">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          {/* Left Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Product Name */}
                            <h3 className="font-semibold text-black leading-tight line-clamp-2 hover:text-gray-500 transition-colors cursor-pointer">
                              {item.name}
                            </h3>

                            {/* Price & Size */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-1">
                                <TagOutlined className="text-gray-500 text-sm" />
                                <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium border border-gray-200">
                                  Size {item.size}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Controls */}
                          <div className="flex flex-col lg:items-end gap-4">
                            {/* Subtotal */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-black">
                                {formatPrice(item.price * item.quantity)}
                                {currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div className="bg-white rounded-2xl p-6">
            <CartTotal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
