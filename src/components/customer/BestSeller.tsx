import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";
import { ProductResponse } from "common/models/product";
import LoadingSpinner from "../LoadingSpinner";

const BestSeller = () => {
  const { products, loadingProducts } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState<ProductResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const bestProduct = products.filter(item => item.bestseller)
    setBestSeller(products.slice(0, 10));
  }, [products]);

  const handleClick = () => {
    navigate("/favorite");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>

      {/* Rendering Products */}
      {loadingProducts ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {bestSeller.map((item, index) => (
              <ProductItem
                key={index}
                id={item.id}
                image={item.image.split(",")[0]}
                name={item.name}
                price={item.price}
                sizes={item.sizes}
                description={item.description}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleClick}
              type="submit"
              className="bg-black rounded-sm text-white text-sm px-10 py-4 border hover:bg-white hover:text-black hover:border-black hover:duration-300"
            >
              More
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BestSeller;
