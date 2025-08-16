import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import { FloatButton } from "antd";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/newproduct" element={<Collection />} />
          <Route path="/favorite" element={<Collection />} />
          <Route path="/restock" element={<Collection />} />
          <Route path="/shop" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order" element={<Orders />} />
        </Routes>
      </main>

      <Footer />
      {/* "Back to Top" */}
      <FloatButton.BackTop />
    </div>
  );
};

export default App;
