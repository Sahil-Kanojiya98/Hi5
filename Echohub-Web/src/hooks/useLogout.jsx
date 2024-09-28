import { useDispatch } from "react-redux";
import { useCallback } from "react";
import axiosInstance from "../utils/axiosConfig";
import { rmAuth } from "../redux/slices/authSlice";
import { removeAccessToken } from "../utils/localStorage";
import { getRefreshToken, removeRefreshToken } from "../utils/indexedDB";

const useLogout = () => {
  const dispatch = useDispatch();
  const logout = useCallback(async () => {
    try {
      const refreshToken = (await getRefreshToken("refreshToken"))?.token;
      console.log(refreshToken);
      if (refreshToken) {
        await axiosInstance.post("/user/logout", {
          refreshToken,
        });
      } else {
        throw new Error("refreshToken not found");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeAccessToken();
      await removeRefreshToken("refreshToken");
      dispatch(rmAuth());
    }
  }, [dispatch]);

  return logout;
};

export default useLogout;
