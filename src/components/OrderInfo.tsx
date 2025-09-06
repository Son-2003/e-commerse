import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { OrderStatus } from "common/enums/OrderStatus";
import {
  OrderDetailResponse,
  OrderResponse,
  SearchOrderRequest,
} from "common/models/order";
import {
  getAllOrdersByCustomerThunk,
  getOrderThunk,
} from "@redux/thunk/orderThunk";
import OrderDetailModal from "./OrderDetailModal";
import { formatDate } from "../utils/FormatDate";
import { DatePicker, Input, Pagination, Select } from "antd";
import LoadingSpinner from "./LoadingSpinner";
import {
  CalendarOutlined,
  ClearOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { resetOrder } from "@redux/slices/orderSlice";
import { formatAddressPart } from "../utils/FormatAddressPart";
import { ShopContext } from "../context/ShopContext";
import { formatPrice } from "../utils/FormatPrice";
import { resetFeedback } from "@redux/slices/feedbackSlice";

const statusStyles: Record<OrderStatus, string> = {
  "": "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  DELIVERED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-700",
  CANCELED: "bg-red-100 text-red-700",
};

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Pending", value: "PENDING" },
  { label: "Canceled", value: "CANCELED" },
];

interface OrderInfoProps {
  activeTab: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ activeTab }) => {
  const { currency } = useContext(ShopContext);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    OrderStatus.ALL
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const dispatch = useDispatch<AppDispatch>();
  const { loadingOrder, orders, orderDetail } = useSelector(
    (state: RootState) => state.order
  );

  const searchRequest: SearchOrderRequest = {
    searchText: searchQuery,
  };

  useEffect(() => {
    const statusFilter =
      selectedStatus === OrderStatus.ALL
        ? [
            OrderStatus.CANCELED,
            OrderStatus.COMPLETED,
            OrderStatus.DELIVERED,
            OrderStatus.PENDING,
          ]
        : [selectedStatus];

    dispatch(
      getAllOrdersByCustomerThunk({
        pageNo: currentPage - 1,
        pageSize,
        sortBy: "id",
        sortDir: "desc",
        request: {
          ...searchRequest,
          statuses: statusFilter,
          dateFrom: dateFrom!,
        },
      })
    );
  }, [
    dispatch,
    activeTab,
    currentPage,
    pageSize,
    searchQuery,
    selectedStatus,
    dateFrom,
    orderDetail,
  ]);

  const openOrder = async (orderId: number) => {
    dispatch(resetOrder());
    const res = await dispatch(getOrderThunk(orderId)).unwrap(); // unwrap để lấy payload trực tiếp
    if (res) {
      setSelectedOrder(res); // dùng dữ liệu mới
      setModalOpen(true);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus(OrderStatus.ALL);
    setDateFrom(null);
  };

  const hasActiveFilters = searchQuery || selectedStatus;

  return (
    <>
      {/* Filters Section */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-1">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              className="rounded-lg border-slate-200 hover:border-blue-300 focus:border-blue-400"
              allowClear
            />
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-52">
            <Select
              placeholder="Filter by Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              size="large"
              className="w-full rounded-sm outline-none border-slate-200 hover:border-blue-300"
              suffixIcon={<FilterOutlined />}
              options={statusOptions}
            />
          </div>

          {/* Date Range Filter */}
          <div className="w-full lg:w-52">
            <DatePicker
              value={dateFrom}
              onChange={setDateFrom}
              size="large"
              className="w-full rounded-lg border-slate-200 hover:border-blue-300"
              suffixIcon={<CalendarOutlined />}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-sm transition-colors"
            >
              <ClearOutlined />
              Clear
            </button>
          )}
        </div>
      </div>
      {loadingOrder ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : orders && orders.content.length > 0 ? (
        <div className="space-y-6">
          {orders.content.map((o) => (
            <article
              key={o.id}
              onClick={() => {
                openOrder(o.id);
                dispatch(resetFeedback());
              }}
              className="cursor-pointer group relative bg-white rounded-sm border shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              {/* Product image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={
                      o.orderDetails[0]?.product?.image?.split(",")[0] ||
                      "/images/product-placeholder.png"
                    }
                    alt={o.orderDetails[0]?.product?.name || "Product"}
                    className="w-24 h-24 object-cover rounded-sm shadow-md ring-1 ring-slate-200"
                  />
                  {o.orderDetails.length > 1 && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-medium rounded-sm w-6 h-6 flex items-center justify-center">
                      +{o.orderDetails.length - 1}
                    </div>
                  )}
                </div>
              </div>

              {/* Info container */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left info */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Order ID + Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="text-sm font-semibold text-gray-900">
                          #{o.id}
                        </p>
                      </div>
                      <div className="sm:hidden mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-sm text-xs font-medium ${
                            statusStyles[o.status]
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(o.createdDate)}
                      </p>
                    </div>

                    {/* Status badge on mobile */}
                  </div>

                  {/* Items */}
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium text-gray-800">Items: </span>
                    {(o.orderDetails || [])
                      .map((it: OrderDetailResponse) => it.product.name)
                      .join(", ")}
                  </p>

                  {/* Address */}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Ship to: </span>
                    <span className="truncate block sm:inline max-w-[320px]">
                      {formatAddressPart(o.address)}
                    </span>
                  </p>
                </div>

                {/* Right info */}
                <div className="flex-shrink-0 flex flex-col sm:items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(o.totalAmount)}
                      {currency}
                    </p>
                  </div>

                  {/* Status badge on desktop */}
                  <div className="hidden sm:block">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[o.status]
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => openOrder(o.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-sm bg-black text-white text-sm font-medium shadow hover:bg-gray-800 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              defaultCurrent={1}
              total={orders.totalElements}
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
          <p className="text-gray-500 text-sm">Don't have any orders</p>
        </div>
      )}

      <OrderDetailModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          dispatch(resetFeedback());
        }}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderInfo;
