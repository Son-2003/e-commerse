import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductResponse, SearchProductRequest } from "common/models/product";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { getAllProductsThunk } from "@redux/thunk/productThunk";
import { EntityStatus } from "common/enums/EntityStatus";
import { CartItem } from "common/models/order";

interface ShopContextType {
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (value: string) => void;
  currentState: string;
  setCurrentState: (value: string) => void;
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  decrementFromCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartAmount: () => number;
  navigate: ReturnType<typeof useNavigate>;
  products: ProductResponse[];
  loadingProducts: boolean;
}

export const ShopContext = createContext<any>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = ({ children }: ShopContextProviderProps) => {
  const currency = " VND";
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>("");
  const [currentState, setCurrentState] = useState<string>("Sign In");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load from localStorage when app starts
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { products, loadingProduct } = useSelector(
    (state: RootState) => state.product
  );
  const searchRequest: SearchProductRequest = {
    statuses: [EntityStatus.ACTIVE],
  };

  useEffect(() => {
    dispatch(
      getAllProductsThunk({
        pageNo: 0,
        pageSize: 10,
        sortBy: "id",
        sortDir: "asc",
        request: searchRequest,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (p) => p.id === item.id && p.size === item.size
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity = item.quantity + 1;
        return updatedCart;
      }

      return [...prevCart, item];
    });
  };

  const getCartCount = (): number => {
    return cartItems.length;
  };

  const decrementFromCart = (item: CartItem) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (p) => p.id === item.id && p.size === item.size
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity = item.quantity - 1;
      }

      return [...prevCart];
    });
  };

  const removeFromCart = (item: CartItem) => {
    setCartItems((prevCart) =>
      prevCart.filter(
        (i) => !(i.id === item.id && (item.size ? i.size === item.size : true))
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartAmount = (): number => {
    let total = 0;
    cartItems.map((item) => (total += item.price * item.quantity));
    return total;
  };

  const value: ShopContextType = {
    currency,
    delivery_fee,
    search,
    setSearch,
    currentState,
    setCurrentState,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    decrementFromCart,
    removeFromCart,
    clearCart,
    getCartAmount,
    navigate,
    products: products.content,
    loadingProducts: loadingProduct,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
