import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { formatPrice } from "../utils/FormatPrice";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, cartItems, cartItemBuyNow } =
    useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p className="text-lg">
            SubTotal -{" "}
            {cartItemBuyNow.length > 0
              ? cartItemBuyNow.length
              : cartItems.length}{" "}
            items
          </p>
          <p className="text-lg">
            {cartItemBuyNow.length > 0
              ? formatPrice(cartItemBuyNow[0].price)
              : formatPrice(getCartAmount())}
            {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p className="text-lg">Shipping Fee</p>
          <p className="text-lg">
            {formatPrice(delivery_fee)}
            {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b className="text-xl">Total</b>
          <b className="text-xl">
            {cartItemBuyNow.length > 0
              ? formatPrice(cartItemBuyNow[0].price + 10)
              : formatPrice(
                  getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee
                )}
            {currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
