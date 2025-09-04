import { useCallback, useEffect, useState } from "react";
import {
  UserOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import CustomerInfo from "components/CustomerInfo";
import OrderInfo from "components/OrderInfo";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { logoutUserThunk } from "@redux/thunk/authThunk";
import { logout } from "@redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "components/LoadingSpinner";
import { getAllOrdersThunk } from "@redux/thunk/orderThunk";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, loadingOrder } = useSelector(
    (state: RootState) => state.order
  );

  const handleLogout = useCallback(() => {
    dispatch(logoutUserThunk());
    dispatch(logout());
    localStorage.removeItem("REFRESH_TOKEN");
    navigate("/");
  }, [dispatch]);
  return (
    <div className="flex items-start justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl bg-white rounded-sm overflow-hidden shadow-lg border border-gray-100 grid grid-cols-1 lg:grid-cols-4">
        {/* Redesigned Sidebar */}
        <aside className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 hidden lg:block">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-blue-100 shadow-md">
                <img
                  src={userInfo?.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {userInfo?.fullName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Premium Member</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-6 space-y-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-200 group ${
                activeTab === "profile"
                  ? "bg-black text-white shadow-lg shadow-gray-300"
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
            >
              <UserOutlined
                className={`text-lg ${
                  activeTab === "profile"
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="font-medium text-sm">Customer Info</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-200 group ${
                activeTab === "orders"
                  ? "bg-black text-white shadow-lg shadow-gray-300"
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
            >
              <ShoppingOutlined
                className={`text-lg ${
                  activeTab === "orders"
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="font-medium text-sm">Order History</span>
            </button>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
              >
                <LogoutOutlined className="text-lg text-red-400 group-hover:text-red-600" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 p-8">
          {/* Mobile tabs */}
          <div className="flex items-center gap-3 lg:hidden mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <UserOutlined />
              Info
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ShoppingOutlined />
              Orders
            </button>
          </div>

          {/* Profile Content */}
          {activeTab === "profile" && (
            <>
              <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-sm p-8 mb-8 border border-blue-100 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                      Customer Info
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Track and modify your information
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {userInfo && (
                  <CustomerInfo
                    fullname={userInfo.fullName}
                    phone={userInfo.phone}
                    address={userInfo.address}
                    image={userInfo.image}
                    status={userInfo.status}
                  />
                )}
              </div>
            </>
          )}

          {/* Orders Content */}
          {activeTab === "orders" && (
            <>
              <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-sm p-8 mb-8 border border-blue-100 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                      Order History
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Track your purchases and delivery status
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    <ShoppingOutlined className="text-black" />
                    <span className="text-sm font-medium text-gray-700">
                      {orders.totalElements}
                    </span>
                  </div>
                </div>
              </div>
              <OrderInfo activeTab={activeTab} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
