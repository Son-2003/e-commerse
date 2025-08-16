import { setTokens } from "@redux/slices/authSlice";
import { AppDispatch } from "@redux/store";
import { getInfoThunk } from "@redux/thunk/authThunk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useAuthRestore() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const restore = async () => {
      const access = await localStorage.getItem("ACCESS_TOKEN");      
      const refresh = await localStorage.getItem("REFRESH_TOKEN");
      if (access) {
        await dispatch(
          setTokens({ accessToken: access, refreshToken: refresh || undefined })
        );
        await dispatch(getInfoThunk());
      }
    };
    restore();
  }, [dispatch]);
}
