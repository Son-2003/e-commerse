import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { getProductThunk } from "@redux/thunk/productThunk";
import {
  MinusOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { formatPrice } from "../utils/FormatPrice";
import ZoomImage from "components/ZoomImage";
import {
  getAllFeedbacksThunk,
  getSummaryFeedbackThunk,
} from "@redux/thunk/feedbackThunk";
import { SearchFeedbackRequest } from "common/models/feedback";
import { EntityStatus } from "common/enums/EntityStatus";
import { formatDate } from "../utils/FormatDate";
import { Pagination } from "antd";
import LoadingSpinner from "components/LoadingSpinner";

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { productDetail } = useSelector((state: RootState) => state.product);
  const { feedbacks, feedbackSummary, loadingFeedback } = useSelector(
    (state: RootState) => state.feedback
  );
  const { currency, addToCart } = useContext(ShopContext);
  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRating, setSelectedRating] = useState("all");

  const searchRequest: SearchFeedbackRequest = {
    statuses: [EntityStatus.ACTIVE],
    productId: Number(productId),
  };

  useEffect(() => {
    dispatch(getProductThunk(Number(productId)));
    dispatch(
      getAllFeedbacksThunk({
        pageNo: currentPage - 1,
        pageSize: pageSize,
        sortBy: "id",
        sortDir: "desc",
        request: searchRequest,
      })
    );
    dispatch(getSummaryFeedbackThunk({ productId: Number(productId) }));
  }, [dispatch, productId]);

  const handleFilterClick = (rating: string) => {
    setSelectedRating(rating);

    dispatch(
      getAllFeedbacksThunk({
        pageNo: currentPage - 1,
        pageSize: pageSize,
        sortBy: "id",
        sortDir: "desc",
        request: {
          ...searchRequest,
          ...(rating !== "all" && { rating: Number(rating) }),
        },
      })
    );
  };

  useEffect(() => {
    if (productDetail?.image) {
      setImage(productDetail.image.split(",")[0]);
    }
  }, [productDetail]);

  const handleAddToCart = () => {
    if (size === "") {
      setError("Please select size first");
    } else {
      addToCart({
        id: productDetail?.id,
        name: productDetail?.name,
        quantity: quantity,
        price: productDetail?.price,
        image: productDetail?.image.split(",")[0],
        size: size,
      });
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
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

  const rating = Math.round(feedbackSummary?.averageRating || 0);

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

          <ZoomImage image={image} />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productDetail.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, index) =>
              index < rating ? (
                <StarFilled key={index} className="text-yellow-300" />
              ) : (
                <StarOutlined key={index} className="text-gray-300" />
              )
            )}
            <p className="pl-2 text-sm">({feedbackSummary?.totalFeedback})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {formatPrice(productDetail.price)}
            {currency}
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
                  className={`border py-2 px-4 mb-3 rounded-sm bg-gray-100 ${
                    item.name === size ? "border-gray-500" : ""
                  }`}
                  key={index}
                >
                  {item.name}
                </button>
              ))}
              <p className={` text-red-500`}>{error}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-sm p-1 border border-gray-200 ">
              <button
                onClick={() => setQuantity(quantity - 1)}
                className="w-8 h-8 rounded-sm flex items-center justify-center text-gray-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <MinusOutlined className="text-xs" />
              </button>

              <div className="w-12 h-8 flex items-center justify-center">
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
            <button
              className={`rounded-sm px-8 py-3 text-sm font-medium transition-all duration-300 ${
                showSuccess
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-gray-800 active:bg-gray-700"
              }`}
              onClick={() => handleAddToCart()}
              disabled={showSuccess}
            >
              {showSuccess ? "✓ ADDED" : "ADD TO CART"}
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review */}
      <div className="mt-20 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="relative border-b border-gray-200">
          <div className="flex space-x-0">
            <button
              onClick={() => setActiveTab("description")}
              className={`relative px-8 py-4 font-medium text-sm transition-all duration-300 ${
                activeTab === "description"
                  ? "text-black border-b-2 border-black bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Description
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-all duration-300"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`relative px-8 py-4 font-medium text-sm transition-all duration-300 ${
                activeTab === "reviews"
                  ? "text-black border-b-2 border-black bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Reviews
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {feedbackSummary?.totalFeedback}
              </span>
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-all duration-300"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white">
          {/* Description Content */}
          {activeTab === "description" && (
            <div className="py-8 px-0 animate-fadeIn">
              <div className="space-y-6">
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-lg font-semibold text-black mb-4 border-l-4 border-black pl-4">
                    Product Overview
                  </h3>
                  <p className="text-gray-600 leading-7 text-sm mb-6">
                    {productDetail?.description ||
                      "An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      Key Features
                    </h4>
                    <p className="text-gray-600 text-sm leading-6">
                      E-commerce websites typically display products or services
                      along with detailed descriptions, images, prices, and any
                      available variations (e.g., sizes, colors).
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      Global Reach
                    </h4>
                    <p className="text-gray-600 text-sm leading-6">
                      Each product usually has its own dedicated page with
                      relevant information, providing accessibility and
                      convenience for customers worldwide.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Premium Quality",
                      "Fast Shipping",
                      "Secure Payment",
                      "Customer Support",
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Content */}
          {activeTab === "reviews" && (
            <div className="py-8 px-0 animate-fadeIn">
              {/* Rating Summary */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-black">
                        {feedbackSummary?.averageRating.toFixed(1)}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) =>
                          index < rating ? (
                            <StarFilled
                              key={index}
                              className="text-yellow-300"
                            />
                          ) : (
                            <StarOutlined
                              key={index}
                              className="text-gray-300"
                            />
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Based on {feedbackSummary?.totalFeedback} reviews
                    </p>
                  </div>
                </div>
                {/* Filter Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {/* All reviews */}
                    <button
                      onClick={() => {
                        setSelectedRating("all");
                        handleFilterClick("all");
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedRating === "all"
                          ? "bg-black text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All Reviews ({feedbackSummary?.totalFeedback || 0})
                    </button>

                    {/* Star filters */}
                    {[
                      { stars: 5, count: feedbackSummary?.fiveStarCount || 0 },
                      { stars: 4, count: feedbackSummary?.fourStarCount || 0 },
                      { stars: 3, count: feedbackSummary?.threeStarCount || 0 },
                      { stars: 2, count: feedbackSummary?.twoStarCount || 0 },
                      { stars: 1, count: feedbackSummary?.oneStarCount || 0 },
                    ].map(({ stars, count }) => (
                      <button
                        key={stars}
                        onClick={() => handleFilterClick(stars.toString())}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          selectedRating === stars.toString()
                            ? "bg-black text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {/* Render số sao */}
                        <div className="flex items-center">
                          {Array.from({ length: stars }).map((_, i) => (
                            <StarFilled
                              key={i}
                              className={`w-3 h-3 ${
                                selectedRating === stars.toString()
                                  ? "text-yellow-300"
                                  : "text-yellow-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span>({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {loadingFeedback ? (
                  <LoadingSpinner />
                ) : feedbacks?.content && feedbacks.content.length > 0 ? (
                  feedbacks.content.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 p-6 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100">
                            <img
                              src={review.image}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-black text-sm">
                                {review.user.fullName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? "text-black"
                                        : "text-gray-300"
                                    } fill-current`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-gray-500 text-xs">
                                {formatDate(review.createdDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {review?.comment.split("\\n").map((line, index) => (
                        <p
                          className="text-gray-600 text-sm leading-6 ml-13"
                          key={index}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      className="w-12 h-12 text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 13h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      Don't have any feedbacks
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  defaultCurrent={1}
                  total={feedbacks?.totalElements}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  showSizeChanger={false}
                  showLessItems
                  responsive
                />
              </div>
            </div>
          )}
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
