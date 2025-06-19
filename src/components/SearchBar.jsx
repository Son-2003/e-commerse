import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("/favorite") ||
      location.pathname.includes("/collection") ||
      location.pathname.includes("/restock")
    ) {
      setVisible(true);
    } else setVisible(false);
  }, [location]);

  return (
    visible && (
      <div className="border-t border-b bg-gray-50 text-center">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 focus-within:border-gray-600 transition">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none bg-inherit text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={assets.search_icon} className="w-4" alt="" />
        </div>
        <img
          src={assets.cross_icon}
          className="inline w-3 cursor-pointer"
          onClick={() => setSearch("")}
          alt=""
        />
      </div>
    )
  );
};

export default SearchBar;
