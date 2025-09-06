import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartOutlined,
  MinusOutlined,
  PhoneOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { formatPrice } from "../utils/FormatPrice";
import { CartItem } from "common/models/order";
import ProductCartModal from "components/ProductCartModal";

const Cart = () => {
  const {
    currency,
    cartItems,
    addToCart,
    removeFromCart,
    decrementFromCart,
    getCartAmount,
    clearItemBuyNow
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [itemUpdate, setItemUpdate] = useState<CartItem>();

  const handleClick = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {cartItems.length === 0 ? (
        <div className="text-center mt-24 h-screen">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full flex items-center justify-center">
            <div className="text-4xl">🛒</div>
          </div>
          <h2 className="font-semibold text-lg">
            YOUR CART IS CURRENTLY EMPTY
          </h2>
          <div className="flex justify-center">
            <span className="my-5 w-[560px] flex items-center">
              Before proceed to checkout you must add some products to your
              shopping cart. You will find a lot of interesting products on our
              Website.
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => handleClick("/collection")}
              type="submit"
              className="bg-black text-white text-sm px-10 py-4 border rounded-sm hover:bg-white hover:text-black hover:border-black hover:duration-300"
            >
              Go To Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl mb-3">
            <Title text1={"YOUR"} text2={"CART"} />
          </div>
          <div className="space-y-4">
            {cartItems.map((item: CartItem, index: number) => (
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

                        {/* Wishlist button */}
                        <button className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md border border-gray-300 flex items-center justify-center text-gray-300 hover:text-red-300 hover:border-red-300 transition-colors opacity-0 group-hover:opacity-100">
                          <HeartOutlined className="text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                        {/* Left Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* Product Name */}
                          <h3
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="text-lg font-semibold text-black leading-tight line-clamp-2 hover:text-gray-500 transition-colors cursor-pointer"
                          >
                            {item.name}
                          </h3>

                          {/* Price & Size */}
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-black">
                                {formatPrice(item.price)}
                                {currency}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.price * 1.2)}
                                {currency}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <TagOutlined className="text-gray-500 text-sm" />
                              <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium border border-gray-200">
                                Size {item.size}
                              </span>
                            </div>
                          </div>

                          {/* Product details */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-500 opacity-75 animate-[ping_1s_linear_infinite]"></span>
                              <CheckCircleOutlined className="relative text-green-600 text-lg bg-white rounded-full" />
                            </div>
                            <span className="text-green-600 font-medium">
                              In stock
                            </span>
                            <EditOutlined
                              onClick={() => {
                                setItemUpdate(item);
                                setVisible(true);
                              }}
                              className="relative text-black text-lg bg-white rounded-full"
                            />
                          </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex flex-col lg:items-end gap-4">
                          {/* Quantity Controls */}
                          <div className="flex">
                            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
                              <button
                                onClick={() => decrementFromCart(item)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <MinusOutlined className="text-xs" />
                              </button>

                              <div className="w-12 h-8 flex items-center justify-center">
                                <input
                                  disabled
                                  type="text"
                                  min="1"
                                  value={item.quantity}
                                  className="w-full h-full text-center text-sm font-semibold bg-transparent border-none outline-none"
                                />
                              </div>

                              <button
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PlusOutlined className="text-xs" />
                              </button>
                            </div>
                            <div className="flex ml-2">
                              <button
                                onClick={() => removeFromCart(item)}
                                className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-red-200 hover:border-red-300 transition-all text-sm font-medium"
                              >
                                <DeleteOutlined className="text-sm group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-xl font-bold text-black">
                              {formatPrice(item.price * item.quantity)}
                              {currency}
                            </p>
                          </div>

                          {/* Action Buttons */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              {getCartAmount() > 0 && (
                <div className="w-full text-end">
                  <button
                    onClick={() => {handleClick("/place-order")
                      clearItemBuyNow()
                    }}
                    className="bg-black text-white text-sm my-8 px-8 py-3 rounded-sm border border-black transition-colors duration-300 hover:text-black hover:bg-white"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {itemUpdate && (
        <ProductCartModal
          item={itemUpdate}
          open={visible}
          onClose={() => {
            setItemUpdate(undefined);
            setVisible(!visible);
          }}
        />
      )}
    </div>
  );
};

export default Cart;
