import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { getCartCount } = useContext(ShopContext);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] sticky top-0 bg-white z-50">
      <div className="flex items-center justify-between py-5 font-medium">
        {/* {!location.pathname.includes("/collection") && (
          <div className="flex w-1/3 items-center">
            <img
              src={assets.search_icon}
              className="w-5 mr-2"
              alt="search-icon"
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-2  outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <img
                src={assets.cross_icon}
                className="w-2 mr-2 cursor-pointer"
                onClick={() => setSearch("")}
                alt=""
              />
            )}
          </div>
        )} */}

        <div className="flex justify-center">
          <Link to={"/"}>
            <img src={assets.logo} alt="logo" className="w-36" />
          </Link>
        </div>

        <div className="flex items-center gap-6 w-1/3 justify-end">
          <img
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="search-icon"
          />
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              alt="cart-icon"
              className="w-5 min-w-5 cursor-pointer"
            />
            <p className="absolute right-[-5px] bottom-[-8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
          <div className="group relative">
            <Link to={"/login"}>
              <img
                src={assets.profile_icon}
                alt="profile-icon"
                className="w-5 cursor-pointer"
              />
            </Link>

            <div className="group-hover:block hidden absolute right-0 pt-2">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-md">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p className="cursor-pointer hover:text-black">Orders</p>
                <p className="cursor-pointer hover:text-black">Login</p>
              </div>
            </div>
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
            <NavLink
              onClick={() => setVisible(false)}
              on
              to="/"
              className="py-2 pl-6 border-b-2"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className="py-2 pl-6 border-b-2"
            >
              NEW ARRIVED
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/favorite"
              className="py-2 pl-6 border-b-2"
            >
              FAVORITE
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className="py-2 pl-6 border-b-2"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/contact"
              className="py-2 pl-6 border-b-2"
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
      <div className="flex justify-center border-t-2 py-3">
        <ul className="hidden sm:flex justify-around w-full h-9 gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1 group">
            <h2 className="text-xl">HOME</h2>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
          </NavLink>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1 group"
          >
            <h2 className="text-xl">NEW ARRIVED</h2>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
          </NavLink>
          <NavLink
            to="/favorite"
            className="flex flex-col items-center gap-1 group"
          >
            <h2 className="text-xl">FAVORITE</h2>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
          </NavLink>

          <NavLink
            to="/about"
            className="flex flex-col items-center gap-1 group"
          >
            <h2 className="text-xl">ABOUT</h2>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
          </NavLink>
          <NavLink
            to="/contact"
            className="flex flex-col items-center gap-1 group"
          >
            <h2 className="text-xl">CONTACT</h2>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block group-hover:opacity-40" />
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
