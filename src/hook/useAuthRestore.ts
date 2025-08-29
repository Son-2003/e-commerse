import { AppDispatch } from "@redux/store";
import { getInfoThunk, refreshTokenThunk } from "@redux/thunk/authThunk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useAuthRestore() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const restore = async () => {
      const storedRefresh = localStorage.getItem("REFRESH_TOKEN");
      if (storedRefresh) {
        try {
          const tokens = await dispatch(refreshTokenThunk(storedRefresh)).unwrap();
          if (tokens.refreshToken) {
            localStorage.setItem("REFRESH_TOKEN", tokens.refreshToken);
          }
          
          await dispatch(getInfoThunk());
        } catch (err) {
          localStorage.removeItem("REFRESH_TOKEN");
        }
      }
    };
    restore();
  }, [dispatch]);
}
