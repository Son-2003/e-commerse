import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ProductResponse, SearchProductRequest } from "common/models/product";
import { Pagination, Spin } from "antd";
import LoadingSpinner from "components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { getAllProductsThunk } from "@redux/thunk/productThunk";
import { EntityStatus } from "common/enums/EntityStatus";
import { Category } from "common/enums/Category";
import { SubCategory } from "common/enums/SubCategory";

const Collection = () => {
  const { search } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState<ProductResponse[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [sortOption, setSortOption] = useState("relavent");
  const [sortBySelected, setSortBySelected] = useState("id");
  const [sortDirSelected, setSortDirSelected] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch<AppDispatch>();
  const { products, loadingProduct } = useSelector(
    (state: RootState) => state.product
  );
  const searchRequest: SearchProductRequest = {
    statuses: [EntityStatus.ACTIVE],
    categories: category,
    subCategories: subCategory,
    name: search,
  };

  useEffect(() => {
    dispatch(
      getAllProductsThunk({
        pageNo: currentPage - 1,
        pageSize: pageSize,
        sortBy: sortBySelected,
        sortDir: sortDirSelected,
        request: searchRequest,
      })
    );
  }, [
    currentPage,
    pageSize,
    category,
    subCategory,
    sortBySelected,
    sortDirSelected,
    search,
    dispatch,
  ]);

  const toggleCategory = (selectedCategory: Category) => {
    setCategory((prev) => {
      if (prev.includes(selectedCategory)) {
        return prev.filter((c) => c !== selectedCategory);
      } else {
        return [...prev, selectedCategory];
      }
    });
  };

  const toggleSubCategory = (selectedSubCategory: SubCategory) => {
    setSubCategory((prev) => {
      if (prev.includes(selectedSubCategory)) {
        return prev.filter((c) => c !== selectedSubCategory);
      } else {
        return [...prev, selectedSubCategory];
      }
    });
  };

  const toggleSort = (sortValue: string) => {
    setSortOption(sortValue);

    switch (sortValue) {
      case "low-high":
        setSortBySelected("price");
        setSortDirSelected("asc");
        break;
      case "high-low":
        setSortBySelected("price");
        setSortDirSelected("desc");
        break;
      default:
        setSortBySelected("id");
        setSortDirSelected("asc");
        break;
    }
  };

  useEffect(() => {
    // sortProducts()
    setFilterProducts(products.content.slice(0, 10));
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <div className="rounded-xl pb-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between cursor-pointer">
            Filters
            <img className="h-3" src={assets.dropdown_icon} alt="" />
          </h3>

          {/* Category */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Categories</p>
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleCategory(Category.MEN)}
                />
                <span>Men</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleCategory(Category.WOMEN)}
                />
                <span>Women</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleCategory(Category.KIDS)}
                />
                <span>Kids</span>
              </label>
            </div>
          </div>

          {/* Type */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Type</p>
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleSubCategory(SubCategory.TOP)}
                />
                <span>Topwear</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleSubCategory(SubCategory.BOTTOM)}
                />
                <span>Bottomwear</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleSubCategory(SubCategory.WINTER)}
                />
                <span>Winterwear</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        {loadingProduct ? (
          <div className="h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex justify-between text-base sm:text-2xl mb-4">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
              {/* Product Sort */}
              <select
                value={sortOption}
                onChange={(e) => toggleSort(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-sm outline-none"
                name=""
                id=""
              >
                <option value="relavent">Sort by: Relavent</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>

            {/* Map Products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item.id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                defaultCurrent={1}
                total={products.totalElements}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
                showSizeChanger={false}
                showLessItems
                responsive
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
