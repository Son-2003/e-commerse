import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useDebounce } from "../hook/useDebounce";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const SearchBar = ({ visible, setVisible }: SearchBarProps) => {
  const { setSearch } = useContext(ShopContext);
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, 500);
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch(localValue.trim());
      navigate("/collection");
    }
  };

  if (!visible) return null;

  return (
    <>
      {visible && (
        <div className="border-t border-b bg-gray-50 text-center">
          <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 focus-within:border-gray-600 transition">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none bg-inherit text-sm"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img src={assets.search_icon} className="w-4" alt="" />
          </div>
          <img
            src={assets.cross_icon}
            className="inline w-3 cursor-pointer"
            onClick={() => setVisible(false)}
            alt=""
          />
        </div>
      )}
    </>
  );
};

export default SearchBar;
