import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Footer from "./components/Footer";
import { FloatButton } from "antd";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import ProtectedRoute from "components/ProtectedRoute";
import { useEffect } from "react";
import PublicRoute from "components/PublicRoute";

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

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar />
      <main className="flex-1">
        <Routes>
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
      {/* "Back to Top" */}
      <FloatButton.BackTop />
    </div>
  );
};

export default App;
