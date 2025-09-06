import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import FashionCarousel from "./FashionCarousel";
import {
  FacebookFilled,
  InstagramOutlined,
  TikTokOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <>
      <FashionCarousel />

      <footer className="text-black">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-10">
          <div className="mb-12">
            <img src={assets.logo} alt="logo" className="w-28 mb-6" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/men">Men</Link>
                </li>
                <li>
                  <Link to="/women">Women</Link>
                </li>
                <li>
                  <Link to="/kids">Kids</Link>
                </li>
                <li>
                  <Link to="/sale">Sale</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/delivery">Delivery</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/help">Help Center</Link>
                </li>
                <li>
                  <Link to="/returns">Returns</Link>
                </li>
                <li>
                  <Link to="/size-guide">Size Guide</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-3 text-sm">
                <a href="tel:+1-000-000-0000" className="block">
                  +1-000-000-0000
                </a>
                <a href="mailto:nguyenducson2915@gmail.com" className="block">
                  Email Us
                </a>

                {/* Social Icons */}
                <div className="flex gap-3 pt-2">
                  <div className="group">
                    <Link
                      to="https://www.instagram.com/ducson_29/"
                      className="w-9 h-9 bg-black rounded-full flex items-center justify-center border border-black group-hover:bg-white transition-colors duration-300"
                    >
                      <InstagramOutlined className="text-white group-hover:text-black" />
                    </Link>
                  </div>

                  <div className="group">
                    <Link
                      to="#"
                      className="w-9 h-9 bg-black rounded-full flex items-center justify-center border border-black group-hover:bg-white transition-colors duration-300"
                    >
                      <FacebookFilled className="text-white group-hover:text-black" />
                    </Link>
                  </div>

                  <div className="group">
                    <Link
                      to="#"
                      className="w-9 h-9 bg-black rounded-full flex items-center justify-center border border-black group-hover:bg-white transition-colors duration-300"
                    >
                      <TikTokOutlined className="text-white group-hover:text-black" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200">
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© 2024 FOREVER. All rights reserved.</p>
              <div className="flex gap-6">
                <Link
                  to="/privacy"
                  className="hover:text-black transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-black transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/cookies"
                  className="hover:text-black transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
