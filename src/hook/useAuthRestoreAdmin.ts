import { AppDispatch } from "@redux/store";
import { getInfoAdminThunk, refreshTokenAdminThunk, refreshTokenThunk } from "@redux/thunk/authThunk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useAuthAdminRestore() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const restore = async () => {
      const storedRefresh = localStorage.getItem("REFRESH_TOKEN_ADMIN");
      if (storedRefresh) {
        try {          
          const tokens = await dispatch(refreshTokenAdminThunk(storedRefresh)).unwrap();
          if (tokens.refreshToken) {
            localStorage.setItem("REFRESH_TOKEN_ADMIN", tokens.refreshToken);
          }
          
          await dispatch(getInfoAdminThunk());
        } catch (err) {
          localStorage.removeItem("REFRESH_TOKEN_ADMIN");
        }
      }
    };
    restore();
  }, [dispatch]);
}
