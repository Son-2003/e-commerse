import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/Home";
import "react-toastify/dist/ReactToastify.css";
import Collection from "./pages/customer/Collection";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import Product from "./pages/customer/Product";
import Cart from "./pages/customer/Cart";
import Login from "./pages/customer/Login";
import PlaceOrder from "./pages/customer/PlaceOrder";
import Profile from "./pages/customer/Profile";
import OrderSuccess from "./pages/customer/OrderSuccess";
import ProtectedRoute from "components/route/ProtectedRoute";
import PublicRoute from "components/route/PublicRoute";
import AdminRoute from "components/route/AdminRoute";
import CustomerLayout from "components/customer/CustomerLayout";
import HomeAdmin from "pages/admin/Home";
import Dashboard from "pages/admin/Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import Chat from "pages/customer/Chat";
import ChatAdmin from "pages/admin/Chat";
import ChatLayout from "components/customer/ChatLayout";
import ProductManage from "pages/admin/ProductManagement";
import OrderManagementSystem from "pages/admin/OrderManagement";
import SettingsPage from "pages/admin/Setting";

const App = () => {
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey &&
  //         e.shiftKey &&
  //         ["I", "J", "C"].includes(e.key.toUpperCase())) ||
  //       (e.ctrlKey && e.key.toUpperCase() === "U")
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };

  //   const handleKeyUp = (e: KeyboardEvent) => {
  //     if (e.key === "F12") {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };

  //   const handleContextMenu = (e: MouseEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     return false;
  //   };

  //   document.addEventListener("keydown", handleKeyDown, true);
  //   document.addEventListener("keyup", handleKeyUp, true);
  //   document.addEventListener("contextmenu", handleContextMenu, true);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown, true);
  //     document.removeEventListener("keyup", handleKeyUp, true);
  //     document.removeEventListener("contextmenu", handleContextMenu, true);
  //   };
  // }, []);

  const { adminInfo } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Customer Layout  */}
      {!adminInfo && (
        <>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/favorite" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route
              path="/profile/:tab"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<Chat />} />
          </Route>
        </>
      )}

      {/* Admin Layout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <HomeAdmin />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chat" element={<ChatAdmin />} />
        <Route path="product" element={<ProductManage />} />
        <Route path="order" element={<OrderManagementSystem />} />
        <Route path="setting" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={adminInfo ? "/admin" : "/"} />} />
    </Routes>
  );
};

export default App;
