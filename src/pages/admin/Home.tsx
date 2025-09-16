import { AppDispatch, RootState } from "@redux/store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Login from "./Login";
import { logoutUserThunk } from "@redux/thunk/authThunk";
import { logout } from "@redux/slices/authSlice";
import {
  LogoutOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { adminInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const menus = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "product", label: "Products", icon: <ShoppingOutlined /> },
    { key: "order", label: "Orders", icon: <ShoppingCartOutlined /> },
    { key: "chat", label: "Chat", icon: <MessageOutlined /> },
    { key: "setting", label: "Settings", icon: <SettingOutlined /> },
  ];

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    navigate(`/admin/${menu}`);
  };

  const handleLogout = useCallback(() => {
    dispatch(logoutUserThunk());
    dispatch(logout());
    localStorage.removeItem("REFRESH_TOKEN_ADMIN");
    navigate("/admin")
  }, [dispatch, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      {!adminInfo ? (
        <Login />
      ) : (
        <div className="h-screen flex overflow-hidden bg-gray-50">
          <aside
            className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? "w-16" : "w-64"
            } flex flex-col z-10`}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 bg-black">
              {!sidebarCollapsed && (
                <h1 className="text-lg font-bold text-white">Management</h1>
              )}
                {sidebarCollapsed ? (
                  <MenuOutlined
                    onClick={toggleSidebar}
                    className="p-2 rounded-sm text-white hover:bg-white/20 transition-colors"
                  />
                ) : (
                  <CloseOutlined
                    onClick={toggleSidebar}
                    className="p-2 rounded-sm text-white hover:bg-white/20 transition-colors"
                  />
                )}
            </div>

            <nav className="flex-1 py-4">
              <ul className="space-y-1 px-2">
                {menus.map((menu) => (
                  <li key={menu.key}>
                    <button
                      onClick={() => handleMenuClick(menu.key)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-sm transition-all duration-200 group ${
                        activeMenu === menu.key
                          ? "bg-gray-100 text-black border-r-4 border-black"
                          : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }`}
                      title={sidebarCollapsed ? menu.label : undefined}
                    >
                      <span
                        className={`text-lg ${
                          activeMenu === menu.key
                            ? "text-black"
                            : "text-gray-500 group-hover:text-black"
                        }`}
                      >
                        {menu.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="font-semibold text-sm">
                          {menu.label}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-gray-100 p-2">
              {!sidebarCollapsed && (
                <div className="px-3 py-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {adminInfo?.fullName?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {adminInfo?.fullName || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {adminInfo?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                title={sidebarCollapsed ? "Logout" : undefined}
              >
                <LogoutOutlined className="text-lg text-red-400 group-hover:text-red-600" />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">Logout</span>
                )}
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
