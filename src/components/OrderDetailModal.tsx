import { OrderResponse } from "common/models/order";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { formatDate } from "../utils/FormatDate";
import { OrderStatus } from "common/enums/OrderStatus";
import { formatPrice } from "../utils/FormatPrice";
import { ShopContext } from "../context/ShopContext";
import { PaymentType } from "common/enums/PaymentType";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CreditCardOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  StarFilled,
  StarOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { FeedbackRequest } from "common/models/feedback";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import {
  createFeedbackThunk,
  getAllFeedbacksOfOrderThunk,
} from "@redux/thunk/feedbackThunk";
import { uploadToCloudinary } from "../utils/CloudinaryImageUploader";
import { getOrderThunk, updateOrderThunk } from "@redux/thunk/orderThunk";

interface Props {
  open: boolean;
  onClose: () => void;
  order?: OrderResponse | null;
}

interface ProductFeedbackState {
  productId: number;
  comment: string;
  rating: number;
  files: File[];
}

type FeedbackField = keyof ProductFeedbackState;

interface PaymentTypeStyle {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

interface CreateFeedbackPayload {
  orderId: number;
  requests: FeedbackRequest[];
}

interface UploadResult {
  url: string | null;
  error?: Error;
}

const statusStyles: Record<OrderStatus, string> = {
  "": "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  DELIVERED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-700",
  CANCELED: "bg-red-100 text-red-700",
} as const;

const paymentTypeStyles: Record<PaymentType, PaymentTypeStyle> = {
  NONE: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "🏦",
  },
  BANK: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <CreditCardOutlined className="text-lg text-blue-600" />,
  },
  CASH: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <DollarOutlined className="text-lg text-green-600" />,
  },
} as const;

const RATING_LABELS = {
  5: "🎉 Excellent!",
  4: "👍 Very Good!",
  3: "😊 Good!",
  2: "😐 Fair",
  1: "😞 Poor",
} as const;

const MAX_IMAGES_PER_PRODUCT = 3;
const CLOUDINARY_FOLDER = "E-commerce/feedback";

const OrderDetailModal: React.FC<Props> = ({ open, onClose, order }) => {
  const { currency } = useContext(ShopContext);
  const dispatch = useDispatch<AppDispatch>();
  const [showFeedbackView, setShowFeedbackView] = useState<boolean>(false);
  const [productFeedbacks, setProductFeedbacks] = useState<
    ProductFeedbackState[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { feedbackOfOrder } = useSelector((state: RootState) => state.feedback);

  // Reset feedback view when modal closes
  useEffect(() => {
    if (!open) {
      setShowFeedbackView(false);
      setProductFeedbacks([]);
    } else if (order) {
      dispatch(getAllFeedbacksOfOrderThunk(order?.id));
    }
  }, [open, dispatch, order]);

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

  const updateProductFeedback = useCallback(
    <T extends FeedbackField>(
      productId: number,
      field: T,
      value: ProductFeedbackState[T]
    ): void => {
      setProductFeedbacks((prev) => {
        const existing = prev.find((f) => f.productId === productId);

        if (existing) {
          return prev.map((f) =>
            f.productId === productId ? { ...f, [field]: value } : f
          );
        } else {
          const newFeedback: ProductFeedbackState = {
            productId,
            comment: "",
            rating: 0,
            files: [],
          };
          newFeedback[field] = value;

          return [...prev, newFeedback];
        }
      });
    },
    []
  );

  const handleImageUpload = useCallback(
    (productId: number, fileList: FileList): void => {
      const filesArray = Array.from(fileList);
      const feedback = productFeedbacks.find((f) => f.productId === productId);
      const currentFiles = feedback?.files || [];

      // Check if total files would exceed maximum
      if (currentFiles.length + filesArray.length > MAX_IMAGES_PER_PRODUCT) {
        alert(
          `You can only upload a maximum of ${MAX_IMAGES_PER_PRODUCT} images!`
        );
        return;
      }

      const newFiles = [...currentFiles, ...filesArray].slice(
        0,
        MAX_IMAGES_PER_PRODUCT
      );
      updateProductFeedback(productId, "files", newFiles);
    },
    [productFeedbacks, updateProductFeedback]
  );

  const removeImage = useCallback(
    (productId: number, fileIndex: number): void => {
      const feedback = productFeedbacks.find((f) => f.productId === productId);
      if (feedback) {
        const newFiles = feedback.files.filter(
          (_, index) => index !== fileIndex
        );
        updateProductFeedback(productId, "files", newFiles);
      }
    },
    [productFeedbacks, updateProductFeedback]
  );

  const uploadImages = useCallback(
    async (files: File[], userName: string): Promise<string[]> => {
      if (files.length === 0) return [];

      try {
        const uploadResults = await Promise.all(
          files.map(async (file): Promise<UploadResult> => {
            try {
              const url = await uploadToCloudinary(
                file,
                userName,
                CLOUDINARY_FOLDER
              );
              return { url };
            } catch (error) {
              console.error(`Failed to upload file ${file.name}:`, error);
              return {
                url: null,
                error:
                  error instanceof Error ? error : new Error("Upload failed"),
              };
            }
          })
        );

        // Filter out failed uploads and extract successful URLs
        const successfulUrls = uploadResults
          .filter(
            (result): result is UploadResult & { url: string } =>
              result.url !== null
          )
          .map((result) => result.url);

        const failedCount = uploadResults.length - successfulUrls.length;
        if (failedCount > 0) {
          console.warn(
            `${failedCount} out of ${files.length} images failed to upload`
          );
        }

        return successfulUrls;
      } catch (error) {
        console.error("Error in batch image upload:", error);
        return [];
      }
    },
    []
  );

  const createFeedbackRequests = useCallback(
    async (
      validFeedbacks: ProductFeedbackState[],
      userName: string
    ): Promise<FeedbackRequest[]> => {
      return Promise.all(
        validFeedbacks.map(async (feedback): Promise<FeedbackRequest> => {
          const imageUrls = await uploadImages(feedback.files, userName);

          return {
            id: 0, // New feedback, so id is 0
            productId: feedback.productId,
            rating: feedback.rating,
            comment: feedback.comment.replace(/\n/g, "\\n").trim(),
            image: imageUrls.join(","), // Join URLs with comma
          };
        })
      );
    },
    [uploadImages]
  );

  const handleSubmitAllFeedback = useCallback(async (): Promise<void> => {
    if (!canSubmitFeedback || isSubmitting || !order) return;

    setIsSubmitting(true);

    try {
      // Filter feedbacks that have meaningful content
      const validFeedbacks = productFeedbacks.filter(
        (feedback): feedback is ProductFeedbackState =>
          feedback.rating > 0 ||
          feedback.comment.replace(/\n/g, "\\n").trim().length > 0 ||
          feedback.files.length > 0
      );

      if (validFeedbacks.length === 0) {
        return;
      }

      // Prepare feedback requests
      const userName = order.user?.fullName || "anonymous_user";
      const feedbackRequests = await createFeedbackRequests(
        validFeedbacks,
        userName
      );

      // Submit all feedbacks
      const payload: CreateFeedbackPayload = {
        orderId: order.id,
        requests: feedbackRequests,
      };

      const result = await dispatch(createFeedbackThunk(payload)).unwrap();
      if (result) {
        await dispatch(getAllFeedbacksOfOrderThunk(order.id)).unwrap();
        setShowFeedbackView(false);
        setProductFeedbacks([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    productFeedbacks,
    isSubmitting,
    order,
    dispatch,
    onClose,
    createFeedbackRequests,
  ]);

  const canSubmitFeedback = productFeedbacks.some(
    (feedback) =>
      feedback.rating > 0 ||
      feedback.comment.replace(/\n/g, "\\n").trim().length > 0 ||
      feedback.files.length > 0
  );

  const handleRatingClick = useCallback(
    (productId: number, rating: number): void => {
      updateProductFeedback(productId, "rating", rating);
    },
    [updateProductFeedback]
  );

  const handleCommentChange = useCallback(
    (productId: number, comment: string): void => {
      updateProductFeedback(productId, "comment", comment);
    },
    [updateProductFeedback]
  );

  const handleFileInputChange = useCallback(
    (productId: number, event: React.ChangeEvent<HTMLInputElement>): void => {
      const files = event.target.files;
      if (files) {
        handleImageUpload(productId, files);
        // Reset input value to allow re-selecting same files
        event.target.value = "";
      }
    },
    [handleImageUpload]
  );

  const getRatingLabel = (rating: number): string => {
    return RATING_LABELS[rating as keyof typeof RATING_LABELS] || "";
  };

  if (!open || !order) return null;

  const handleCancelOrder = async () => {
    const result = await dispatch(
      updateOrderThunk({
        orderId: order.id,
        status: OrderStatus.CANCELED,
      })
    ).unwrap();
    if (result) {
      await dispatch(getOrderThunk(order.id));
      onClose();
    }
  };

  const paymentStyle = paymentTypeStyles[order.paymentHistory.type];

  console.log(feedbackOfOrder);
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-sm sm:rounded-sm w-full max-w-sm sm:max-w-2xl lg:max-w-3xl z-10 flex flex-col h-[95vh] sm:max-h-[90vh] animate-scaleIn overflow-hidden">
        <div className="relative w-full h-full flex">
          <div
            className={`w-full flex-shrink-0 flex flex-col transition-transform duration-500 ease-in-out ${
              showFeedbackView ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b flex-shrink-0">
              <div className="min-w-0 flex-1 mr-3">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                  Order #{order.id}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(order.createdDate)}
                  </p>
                  <span className="hidden sm:inline text-gray-400 mx-2">•</span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium w-fit ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-2 py-1 sm:px-3 sm:py-2 rounded-full transition-colors flex-shrink-0 hover:bg-gray-100"
                type="button"
                aria-label="Close modal"
              >
                <CloseCircleOutlined className="text-2xl text-gray-400 hover:text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Shipping address
                  </p>
                  <div className="bg-gray-50 rounded-sm p-3 border border-opacity-20">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <EnvironmentOutlined className="text-lg text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-gray-800 text-sm">
                          {order.address.split("//")[0]}
                        </span>
                        <span className="text-gray-500 text-xs mt-1">
                          {order.address.split("//")[1]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method & Status */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Payment method
                  </p>
                  <div
                    className={`${paymentStyle.bg} rounded-sm p-3 border border-opacity-20`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0">{paymentStyle.icon}</div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`font-medium text-sm ${paymentStyle.text}`}
                          >
                            {order.paymentHistory.type === PaymentType.BANK
                              ? "Bank Transfer"
                              : "Cash Payment"}
                          </span>
                          <span className="text-xs text-gray-600 mt-0.5">
                            {order.paymentHistory.type === PaymentType.BANK
                              ? "Electronic payment"
                              : "Pay on delivery"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {order.paymentHistory.status === "PAID" ? (
                          <CheckCircleFilled className="text-green-600" />
                        ) : (
                          <CloseCircleFilled className="text-red-600" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            order.paymentHistory.status === "PAID"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {order.paymentHistory.status === "PAID"
                            ? "Paid"
                            : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Items */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-3">
                  {order.orderDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border rounded-sm p-3"
                    >
                      <img
                        src={
                          item.product.image.split(",")[0] ||
                          "/images/product-placeholder.png"
                        }
                        alt={item.product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                          {item.product.name}
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            Price: {formatPrice(item.unitPrice)}
                            {currency}
                          </span>
                        </div>
                      </div>
                      <div className="font-medium text-sm sm:text-base flex-shrink-0">
                        {formatPrice(item.totalPrice)}
                        {currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end pt-3 border-t">
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-500">Total</div>
                  <div className="text-lg sm:text-xl font-semibold">
                    {formatPrice(order.totalAmount)}
                    {currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback button (only if completed) */}
            {order.status === OrderStatus.COMPLETED && (
              <div className="p-4 sm:p-5 bg-white border-t border flex-shrink-0">
                <button
                  onClick={() => setShowFeedbackView(true)}
                  className="w-full py-3 sm:py-4 px-4 bg-black text-white rounded-sm font-medium text-sm sm:text-base cursor-pointer hover:bg-gray-800 transition-colors"
                  type="button"
                >
                  <span className="block sm:hidden">
                    {feedbackOfOrder?.length !== 0 ? "View Feedback" : "Rate Products"}
                  </span>
                  <span className="hidden sm:block">
                    {feedbackOfOrder?.length !== 0
                      ? "View Feedback"
                      : "Rate & Review Products"}
                  </span>
                </button>
              </div>
            )}

            {order.status === OrderStatus.PENDING && (
              <div className="p-4 sm:p-5 bg-white border-t border flex-shrink-0">
                {!confirmCancel ? (
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="w-full py-3 sm:py-4 px-4 bg-black text-white rounded-sm font-medium text-sm sm:text-base cursor-pointer hover:bg-gray-800 transition-colors"
                    type="button"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancelOrder()}
                      className="flex-1 py-3 sm:py-4 px-4 bg-red-600 text-white rounded-sm font-medium text-sm sm:text-base cursor-pointer hover:bg-red-700 transition-colors"
                      type="button"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 py-3 sm:py-4 px-4 bg-gray-200 text-gray-700 rounded-sm font-medium text-sm sm:text-base cursor-pointer hover:bg-gray-300 transition-colors"
                      type="button"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feedback View */}
          <div
            className={`w-full flex-shrink-0 flex flex-col transition-transform duration-500 ease-in-out ${
              showFeedbackView ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Feedback Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b flex-shrink-0">
              <button
                onClick={() => setShowFeedbackView(false)}
                className="p-2 flex-shrink-0 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
                type="button"
                aria-label="Go back to order details"
              >
                <ArrowLeftOutlined className="text-lg text-gray-500 hover:text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-black">
                  Rate & Review
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Order #{order.id}
                </p>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              {feedbackOfOrder && feedbackOfOrder.length > 0 ? (
                <>
                  <div className="space-y-5">
                    {feedbackOfOrder.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-sm p-4 sm:p-5 border"
                        >
                          {/* Product Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={item.product.image.split(",")[0]}
                                alt={item.product.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-sm"
                              />
                              <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 leading-tight">
                                {item.product.name}
                              </h4>
                              <div className="flex gap-2">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  Price: {formatPrice(item.product.price)}
                                  {currency}
                                </p>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-black">
                                {formatPrice(item.totalPrice)}
                                {currency}
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <StarOutlined />
                              <span>Product Quality:</span>
                            </p>
                            <div className="flex gap-2">
                              {([1, 2, 3, 4, 5] as const).map((star) => (
                                <button
                                  key={star}
                                  onClick={() =>
                                    handleRatingClick(item.product.id, star)
                                  }
                                  disabled
                                  className="text-2xl sm:text-3xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                                  type="button"
                                  aria-label={`Rate ${star} stars`}
                                >
                                  {star <= (item?.rating || 0) ? (
                                    <StarFilled className="text-yellow-400 drop-shadow-lg" />
                                  ) : (
                                    <StarOutlined className="text-gray-300 hover:text-yellow-300" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Text Review */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <MessageOutlined />
                              <span>Your Review:</span>
                            </p>
                            <div className="w-full border-2 rounded-xl px-3 py-2 text-sm min-h-[72px]">
                              
                              {item?.comment.split("\\n").map((line, index) => (
                                <p
                                  className="text-gray-600 text-sm leading-6 ml-13"
                                  key={index}
                                >
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Image Upload */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <CameraOutlined />
                              <span>Your Photos</span>
                            </p>

                            <div className="mt-3 flex gap-2 flex-wrap">
                              {/* Display uploaded images */}
                              {item?.image.split(",")?.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="relative group w-28 h-40 border-2 border-gray-300 rounded-lg overflow-hidden"
                                >
                                  <img
                                    src={file}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-5">
                    {order.orderDetails.map((item, index) => {
                      const feedback = productFeedbacks.find(
                        (f) => f.productId === item.product.id
                      );

                      return (
                        <div
                          key={item.product.id}
                          className="bg-white rounded-sm p-4 sm:p-5 border"
                        >
                          {/* Product Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={item.product.image.split(",")[0]}
                                alt={item.product.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-sm"
                              />
                              <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 leading-tight">
                                {item.product.name}
                              </h4>
                              <div className="flex gap-2">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  Price: {formatPrice(item.unitPrice)}
                                  {currency}
                                </p>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-black">
                                {formatPrice(item.totalPrice)}
                                {currency}
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <StarOutlined />
                              <span>Product Quality:</span>
                            </p>
                            <div className="flex gap-2">
                              {([1, 2, 3, 4, 5] as const).map((star) => (
                                <button
                                  key={star}
                                  onClick={() =>
                                    handleRatingClick(item.product.id, star)
                                  }
                                  disabled={isSubmitting}
                                  className="text-2xl sm:text-3xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                  type="button"
                                  aria-label={`Rate ${star} stars`}
                                >
                                  {star <= (feedback?.rating || 0) ? (
                                    <StarFilled className="text-yellow-400 drop-shadow-lg" />
                                  ) : (
                                    <StarOutlined className="text-gray-300 hover:text-yellow-300" />
                                  )}
                                </button>
                              ))}
                            </div>
                            {feedback?.rating && feedback.rating > 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                {getRatingLabel(feedback.rating)}
                              </p>
                            )}
                          </div>

                          {/* Text Review */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <MessageOutlined />
                              <span>Your Review:</span>
                            </p>
                            <textarea
                              placeholder="Share your experience with this product..."
                              value={feedback?.comment || ""}
                              onChange={(e) =>
                                handleCommentChange(
                                  item.product.id,
                                  e.target.value
                                )
                              }
                              disabled={isSubmitting}
                              rows={3}
                              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-gray-400 transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Image Upload */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <CameraOutlined />
                              <span>
                                Add Photos (Max {MAX_IMAGES_PER_PRODUCT})
                              </span>
                            </p>

                            <div className="mt-3 flex gap-2 flex-wrap">
                              {/* Display uploaded images */}
                              {feedback?.files?.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="relative group w-28 h-40 border-2 border-gray-300 rounded-lg overflow-hidden"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Remove button */}
                                  <button
                                    onClick={() =>
                                      removeImage(item.product.id, idx)
                                    }
                                    disabled={isSubmitting}
                                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                    aria-label={`Remove image ${idx + 1}`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}

                              {/* Upload area */}
                              {(!feedback?.files ||
                                feedback.files.length <
                                  MAX_IMAGES_PER_PRODUCT) &&
                                !isSubmitting && (
                                  <label className="cursor-pointer">
                                    <div className="flex flex-col items-center justify-center gap-2 w-28 h-40 border-2 border-dashed border-gray-500 rounded-lg hover:border-gray-600 hover:bg-gray-100 transition-all duration-200 group">
                                      <CameraOutlined className="text-2xl text-gray-500 group-hover:scale-110 transition-transform" />
                                      <span className="text-xs text-gray-500 font-medium text-center">
                                        Upload
                                      </span>
                                    </div>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileInputChange(
                                          item.product.id,
                                          e
                                        )
                                      }
                                      className="hidden"
                                    />
                                  </label>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {feedbackOfOrder?.length === 0 && (
              <>
                {/* Feedback Footer */}
                <div className="p-4 sm:p-5 bg-white border-t border flex-shrink-0">
                  <button
                    onClick={handleSubmitAllFeedback}
                    disabled={!canSubmitFeedback || isSubmitting}
                    className="w-full py-3 sm:py-4 px-4 bg-black text-white rounded-sm font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                    type="button"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : canSubmitFeedback
                      ? "Submit Reviews"
                      : "Rate a product"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bg-orange-25 {
          background-color: #fffbf5;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailModal;
