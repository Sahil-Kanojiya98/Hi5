import { useState } from "react";
import { setAccessToken, removeAccessToken } from "../utils/localStorage";
import { setRefreshToken, removeRefreshToken } from "../utils/indexedDB";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { addAuth, rmAuth } from "../redux/slices/authSlice";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      await setRefreshToken({ id: "refreshToken", token: refreshToken });
      console.log(response);
      const userResponse = await axiosInstance.get("/user/get-me");
      const userData = userResponse.data;
      console.log(userData);
      dispatch(
        addAuth({
          isAuthenticated: true,
          user: userData,
        })
      );
    } catch (err) {
      setError(err.response?.data || "Login failed");
      removeAccessToken();
      removeRefreshToken("refreshToken");
      dispatch(rmAuth());
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};

export default useLogin;