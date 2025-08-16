import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { getProductThunk } from "@redux/thunk/productThunk";

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { productDetail } = useSelector((state: RootState) => state.product);
  const { currency, addToCart } = useContext(ShopContext);
  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    dispatch(getProductThunk(Number(productId)));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetail?.image) {
      setImage(productDetail.image.split(",")[0]);
    }
  }, [productDetail]);

  const handleAddToCart = () => {
    if (size === "") {
      setError("Vui lòng chọn size");
    } else {
      addToCart({
        id: productDetail?.id,
        name: productDetail?.name,
        quantity: 1,
        price: productDetail?.price,
        image: productDetail?.image.split(",")[0],
        size: size,
      });
    }
  };

  const handleSelectSize = (sizeSelected: string) => {
    if (size === sizeSelected) {
      setSize("");
    } else {
      setError("");
      setSize(sizeSelected);
    }
  };

  return productDetail ? (
    <div className="border-t-2 pt-2 transition-opacity ease-in duration-500 opacity-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]">
            {productDetail?.image.split(",").map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productDetail.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productDetail.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productDetail.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex-col gap-2">
              {productDetail.sizes.map((item, index) => (
                <button
                  onClick={() => handleSelectSize(item.name)}
                  className={`border py-2 px-4 mb-3 bg-gray-100 ${
                    item.name === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item.name}
                </button>
              ))}
              <p className={` text-red-500`}>{error}</p>
            </div>
          </div>

          <button
            className={`bg-black text-white active:bg-gray-700 px-8 py-3 text-sm`}
            onClick={() => handleAddToCart()}
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      {/* Related Product */}
      <RelatedProducts
        category={productDetail.category}
        subCategory={productDetail.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
