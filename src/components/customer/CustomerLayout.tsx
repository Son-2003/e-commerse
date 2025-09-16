import { ToastContainer } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { FloatButton } from "antd";

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <FloatButton.BackTop />
    </div>
  );
}
