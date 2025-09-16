import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/FormatPrice";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { SizeResponse } from "common/models/size";
import { Modal } from "antd";

interface ProductItemProps {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  sizes: SizeResponse[];
}

const ProductItem = ({
  id,
  name,
  description,
  price,
  image,
  sizes,
}: ProductItemProps) => {
  const [added, setAdded] = useState(false);
  const { currency, addToCart, addItemToBuyNow } = useContext(ShopContext);
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuccessBuyNow, setShowSuccessBuyNow] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string>("");
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    setOpen(!open);
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (sizes) {
      setSize(sizes[0].name);
    }
  }, [id]);

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

  const handleAddToCart = () => {
    if (open) {
      setShowSuccess(true);
    } else {
      setAdded(true);
    }

    addToCart({
      id: id,
      name: name,
      quantity: quantity,
      price: price,
      image: image.split(",")[0],
      size: size,
      sizes: sizes,
    });

    setTimeout(() => {
      if (open) {
        setShowSuccess(false);
      } else {
        setAdded(false);
      }
    }, 1500);
  };

  const handleBuyNow = () => {
    addItemToBuyNow({
      id: id,
      name: name,
      quantity: quantity,
      price: price,
      image: image.split(",")[0],
      size: size,
      sizes: sizes,
    });
    setShowSuccessBuyNow(true);

    setTimeout(() => {
      setShowSuccessBuyNow(false);
      setOpen(!open);
      navigate("/place-order");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  const toggleLike = () => setLiked(!liked);

  return (
    <div className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden group relative">
        <img
          onClick={() => handleClick(id)}
          className="group-hover:scale-110 transition ease-in-out duration-300"
          src={image}
          alt=""
        />

        <div className="absolute top-4 right-2 flex flex-col space-y-2 sm:opacity-0 sm:translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:scale-110 transition"
          >
            <ShoppingCartOutlined
              className={`absolute transition-all duration-300 ${
                added ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <CheckCircleFilled
              className={`absolute transition-all duration-300 ${
                added ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </button>
          <button
            onClick={toggleLike}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:scale-110 transition"
          >
            <HeartOutlined
              className={`absolute transition-all duration-300 ${
                liked ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <HeartFilled
              className={`text-red-500 absolute transition-all duration-300 ${
                liked ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:scale-110 transition"
          >
            <EyeOutlined size={18} />
          </button>
        </div>
      </div>
      <div onClick={() => handleClick(id)}>
        <p className="pt-3 pb-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </p>
        <p className="text-base font-medium">
          {formatPrice(price)}
          {currency}
        </p>
      </div>

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        width={1000}
      >
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 max-h-[80vh] overflow-y-auto">
          {/* Product Images */}
          <div className="flex-1 flex justify-center sm:justify-start">
            <img
              src={image}
              alt=""
              className={`w-full h-auto transition-opacity duration-300`}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 flex-col">
            <div className="w-full sm:max-w-md inline-flex flex-col">
              <h1 className="font-medium text-2xl overflow-hidden text-ellipsis whitespace-nowrap">
                {name}
              </h1>
              <p className="mt-3 text-3xl font-medium">
                {formatPrice(price)}
                {currency}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-500 opacity-75 animate-[ping_1s_linear_infinite]"></span>
                  <CheckCircleOutlined className="relative text-green-600 text-lg bg-white rounded-full" />
                </div>
                <span className="text-green-600 font-medium">In stock</span>
              </div>

              <p className="mt-5 text-gray-500 md:w-full">{description}</p>

              <div className="flex flex-col gap-4 my-8">
                <p>Size: {size}</p>
                <div className="flex gap-2">
                  {sizes &&
                    sizes.map((item, index) => (
                      <button
                        onClick={() => setSize(item.name)}
                        className={`border px-4 py-2 rounded-sm border-black ${
                          item.name === size ? "bg-black text-white" : ""
                        }`}
                        key={index}
                      >
                        {item.name}
                      </button>
                    ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="flex justify-between order-2 sm:order-1 items-center gap-1 rounded-sm p-1 border border-black">
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    className="w-8 h-8 rounded-sm flex items-center justify-center hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <MinusOutlined className="text-xs" />
                  </button>

                  <div className="w-10 h-8 flex items-center justify-center">
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
                      className="w-full h-full text-center text-sm font-semibold bg-transparent border-none outline-none"
                    />
                  </div>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-sm flex items-center justify-center text-gray-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusOutlined className="text-xs" />
                  </button>
                </div>
                <div className="flex gap-2 order-1 w-full sm:order-2">
                  <button
                    className={`rounded-sm px-16 w-full text-sm font-medium transition-all duration-300 border border-black ${
                      showSuccess
                        ? "bg-white text-black border border-black"
                        : "bg-black text-white hover:bg-white hover:text-black"
                    }`}
                    onClick={handleAddToCart}
                    disabled={showSuccess}
                  >
                    {showSuccess ? "✓ ADDED" : "ADD TO CART"}
                  </button>
                  <div className="border border-black rounded-sm flex items-center justify-center bg-white">
                    <button
                      onClick={toggleLike}
                      className="relative flex items-center justify-center p-4"
                    >
                      <HeartOutlined
                        className={`transition-transform duration-300 text-lg ${
                          liked
                            ? "opacity-0 scale-0"
                            : "opacity-100 scale-100 hover:scale-110"
                        }`}
                      />
                      <HeartFilled
                        className={`text-red-500 text-lg absolute transition-transform duration-300 ${
                          liked
                            ? "opacity-100 scale-100 hover:scale-110"
                            : "opacity-0 scale-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <button
                className={`rounded-sm mt-5 w-full px-8 py-3 text-sm font-medium transition-all duration-300 border border-black ${
                  showSuccessBuyNow
                    ? "bg-white text-black border border-black"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
                onClick={handleBuyNow}
                disabled={showSuccessBuyNow}
              >
                {showSuccessBuyNow ? "✓ BOUGHT IT" : "BUY IT NOW"}
              </button>
              <hr className="mt-8 sm:w-4/5" />
              <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductItem;
