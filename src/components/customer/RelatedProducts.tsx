import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ProductResponse } from "common/models/product";
import { Category } from "common/enums/Category";
import { SubCategory } from "common/enums/SubCategory";

interface RelatedProductsProps {
  category: Category;
  subCategory: SubCategory;
}

const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState<ProductResponse[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      let productRelated = products.slice();
      productRelated = productRelated.filter(
        (item: ProductResponse) => category === item.category
      );
      productRelated = productRelated.filter(
        (item: ProductResponse) => subCategory === item.subCategory
      );

      setRelated(productRelated.slice(0, 5));
    }
  }, [products]);
  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
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
    </div>
  );
};

export default RelatedProducts;
