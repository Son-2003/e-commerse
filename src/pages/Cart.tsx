import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { ProductResponse } from "common/models/product";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { currency, cartItems, addToCart, removeFromCart, getCartAmount } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/place-order");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {cartItems.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={item.image} alt="" />
                <div>
                  <p className="text-xs font-medium sm:text-lg">{item.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : addToCart({
                        id: item?.id,
                        name: item.name,
                        quantity: 1,
                        price: item.price,
                        image: item.image.split(",")[0],
                        size: item.size,
                      })
                }
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              />
              <img
                onClick={() => removeFromCart(item.id, item.size)}
                src={assets.bin_icon}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          {getCartAmount() > 0 && (
            <div className="w-full text-end">
              <button
                onClick={handleClick}
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
