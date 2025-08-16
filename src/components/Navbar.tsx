import { useCallback, useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
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
    dispatch(logout());
    dispatch(logoutUserThunk());
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
  }, [dispatch]);

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
            <div className="group relative">
              {userInfo === null ? (
                <div className="flex">
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
                <>
                  <img
                    src={assets.profile_icon}
                    alt="profile-icon"
                    className="w-5 cursor-pointer"
                  />

                  <div className="group-hover:block hidden absolute right-0 pt-2">
                    <div className="flex flex-col gap-2 w-44 py-3 px-5 bg-slate-100 text-gray-500 rounded-md">
                      <p className="text-black font-semibold text-base overflow-hidden text-ellipsis whitespace-nowrap">
                        Hello, {userInfo.fullName}
                      </p>
                      <p className="cursor-pointer hover:text-black">
                        My Profile
                      </p>
                      <p className="cursor-pointer hover:text-black">History</p>
                      <p
                        className="cursor-pointer hover:text-black"
                        onClick={handleLogout}
                      >
                        LogOut
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-5 cursor-pointer sm:hidden"
              alt=""
            />
          </div>
          {/* Sidebar menu for small screens  */}
          <div
            className={`absolute top-0 right-0 bottom-0 transition-all bg-white ${
              visible ? "w-full" : "w-0 hidden"
            }`}
          >
            <div className="flex flex-col text-gray-600 bg-white">
              <div
                onClick={() => setVisible(false)}
                className="flex items-center gap-4 p-3 cursor-pointer"
              >
                <img
                  src={assets.dropdown_icon}
                  alt=""
                  className="h-4 rotate-180"
                />
                <p>Back</p>
              </div>
              <button
                onClick={() => handleClickMobile("/")}
                className="py-2 pl-6 border-b-2"
              >
                HOME
              </button>
              <button
                onClick={() => handleClickMobile("/collection")}
                className="py-2 pl-6 border-b-2"
              >
                NEW ARRIVED
              </button>
              <button
                onClick={() => handleClickMobile("/favorite")}
                className="py-2 pl-6 border-b-2"
              >
                FAVORITE
              </button>
              <button
                onClick={() => handleClickMobile("/about")}
                className="py-2 pl-6 border-b-2"
              >
                ABOUT
              </button>
              <button
                onClick={() => handleClickMobile("/contact")}
                className="py-2 pl-6 border-b-2"
              >
                CONTACT
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center border-t-2 py-3">
          <ul className="hidden sm:flex justify-around w-full h-9 gap-5 text-sm text-gray-700">
            <button
              onClick={() => handleClick("/")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">HOME</h2>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
            </button>
            <button
              onClick={() => handleClick("/collection")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">NEW ARRIVED</h2>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
            </button>
            <button
              onClick={() => handleClick("/favorite")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">FAVORITE</h2>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
            </button>

            <button
              onClick={() => handleClick("/about")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">ABOUT</h2>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
            </button>
            <button
              onClick={() => handleClick("/contact")}
              className="flex flex-col items-center gap-1 group"
            >
              <h2 className="text-xl">CONTACT</h2>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
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
