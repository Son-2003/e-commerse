import { useCallback, useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { logout } from "@redux/slices/authSlice";
import { logoutUserThunk } from "@redux/thunk/authThunk";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const { getCartCount, setCurrentState } = useContext(ShopContext);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (route: string) => {
    navigate(route);
    setVisibleSearch(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickMobile = (route: string) => {
    setVisible(false);
    navigate(route);
    setVisibleSearch(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = useCallback(() => {
    dispatch(logoutUserThunk());
    dispatch(logout());
    localStorage.removeItem("REFRESH_TOKEN");
    navigate("/");
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  return (
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] sticky top-0 bg-white z-50">
        <div className="flex items-center justify-between py-5 font-medium">
          <div className="flex justify-center">
            <button onClick={() => handleClick("/")}>
              <img src={assets.logo} alt="logo" className="w-36" />
            </button>
          </div>

          <div className="flex items-center gap-6 w-1/3 justify-end">
            <img
              onClick={() => setVisibleSearch(!visibleSearch)}
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt="search-icon"
            />
            <button onClick={() => handleClick("/cart")} className="relative">
              <img
                src={assets.cart_icon}
                alt="cart-icon"
                className="w-5 min-w-5 cursor-pointer"
              />
              <p className="absolute right-[-5px] bottom-[-8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </button>
            {userInfo === null ? (
              <div className="hidden sm:flex">
                <p
                  className="hover:text-gray-500 cursor-pointer"
                  onClick={() => {
                    handleClick("/login");
                    setCurrentState("Sign In");
                  }}
                >
                  Sign In
                </p>
                <p className="mx-1">/</p>
                <p
                  className="hover:text-gray-500 cursor-pointer"
                  onClick={() => {
                    handleClick("/login");
                    setCurrentState("Sign Up");
                  }}
                >
                  Sign Up
                </p>
              </div>
            ) : (
              <div className="group relative flex-shrink-0">
                <img
                  src={assets.profile_icon}
                  alt="profile-icon"
                  className="w-5 cursor-pointer"
                />

                <div className="group-hover:block hidden absolute right-0 pt-2">
                  <div className="flex flex-col bg-white rounded-sm overflow-hidden border border-gray-100">
                    <div className="px-5 py-3 border-b">
                      <p className="text-gray-800 font-semibold text-sm truncate">
                        Hello, {userInfo.fullName}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <button
                        className="px-5 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left transition"
                        onClick={() => handleClick("profile")}
                      >
                        My Profile
                      </button>
                      <button className="px-5 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left transition">
                        History
                      </button>
                      <button
                        className="px-5 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 text-left transition"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-5 cursor-pointer sm:hidden"
              alt=""
            />
          </div>
          <div
            className={`fixed inset-0 z-50 bg-white transition-opacity duration-300 ${
              visible ? "w-full h-full" : "w-0 hidden"
            }`}
          >
            <div className="flex flex-col h-full text-gray-700">
              {/* Header */}
              <div
                onClick={() => setVisible(false)}
                className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <img
                  src={assets.dropdown_icon}
                  alt="Back"
                  className="h-4 rotate-180 opacity-70"
                />
                <p className="text-sm font-medium">Back</p>
              </div>

              {/* Auth */}
              <div className="flex-col h-full justify-center gap-2 py-3 border-y border-gray-100">
                {!userInfo && (
                  <div
                    className={`flex px-6 py-3 justify-center text-sm font-medium transition w-full ${
                      location.pathname === "/login"
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        handleClickMobile("/login");
                        setCurrentState("Sign In");
                      }}
                      className="text-sm font-medium hover:text-black"
                    >
                      SIGN IN
                    </button>
                    <span className="text-gray-400 mx-1"> / </span>
                    <button
                      onClick={() => {
                        handleClickMobile("/login");
                        setCurrentState("Sign Up");
                      }}
                      className="text-sm font-medium hover:text-black"
                    >
                      SIGN UP
                    </button>
                  </div>
                )}

                {[
                  { label: "HOME", path: "/" },
                  { label: "NEW ARRIVED", path: "/collection" },
                  { label: "FAVORITE", path: "/favorite" },
                  { label: "ABOUT", path: "/about" },
                  { label: "CONTACT", path: "/contact" },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleClickMobile(item.path)}
                    className={`px-6 py-3 text-center text-sm font-medium transition w-full ${
                      location.pathname === item.path
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center border-t sm:border-y-[1px] py-3">
          <ul className="hidden sm:flex justify-around w-full h-9 gap-5 text-sm text-gray-700">
            <button
              onClick={() => handleClick("/")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">HOME</h2>
              <hr
                className={`w-2/4 border-none h-[1.5px] transition ${
                  location.pathname === "/"
                    ? "bg-gray-900 block opacity-100"
                    : "bg-gray-700 hidden group-hover:block group-hover:opacity-40"
                }`}
              />
            </button>
            <button
              onClick={() => handleClick("/collection")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">NEW ARRIVED</h2>
              <hr
                className={`w-2/4 border-none h-[1.5px] transition ${
                  location.pathname === "/collection"
                    ? "bg-gray-900 block opacity-100"
                    : "bg-gray-700 hidden group-hover:block group-hover:opacity-40"
                }`}
              />
            </button>
            <button
              onClick={() => handleClick("/favorite")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">FAVORITE</h2>
              <hr
                className={`w-2/4 border-none h-[1.5px] transition ${
                  location.pathname === "/favorite"
                    ? "bg-gray-900 block opacity-100"
                    : "bg-gray-700 hidden group-hover:block group-hover:opacity-40"
                }`}
              />
            </button>

            <button
              onClick={() => handleClick("/about")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">ABOUT</h2>
              <hr
                className={`w-2/4 border-none h-[1.5px] transition ${
                  location.pathname === "/about"
                    ? "bg-gray-900 block opacity-100"
                    : "bg-gray-700 hidden group-hover:block group-hover:opacity-40"
                }`}
              />
            </button>
            <button
              onClick={() => handleClick("/contact")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">CONTACT</h2>
              <hr
                className={`w-2/4 border-none h-[1.5px] transition ${
                  location.pathname === "/contact"
                    ? "bg-gray-900 block opacity-100"
                    : "bg-gray-700 hidden group-hover:block group-hover:opacity-40"
                }`}
              />
            </button>
          </ul>
        </div>
      </div>
      <SearchBar
        visible={visibleSearch}
        setVisible={() => setVisibleSearch(!visibleSearch)}
      />
    </>
  );
};

export default Navbar;
