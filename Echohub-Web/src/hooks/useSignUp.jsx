import { useState } from "react";
import { setAccessToken, removeAccessToken } from "../utils/localStorage";
import { setRefreshToken, removeRefreshToken } from "../utils/indexedDB";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import { addAuth, rmAuth } from "../redux/slices/authSlice";

const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const signUp = async (email, username, fullName, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/register", {
        email: email,
        username: username,
        fullname: fullName,
        password: password,
      });
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      await setRefreshToken({ id: "refreshToken", token: refreshToken });
      const userResponse = await axiosInstance.get("/user/get-me");
      const userData = userResponse.data;
      dispatch(
        addAuth({
          isAuthenticated: true,
          user: userData,
        })
      );
    } catch (err) {
      console.log(err?.response?.data);
      setError(err?.response?.data || "Sign up failed");
      removeAccessToken();
      removeRefreshToken("refreshToken");
      dispatch(rmAuth());
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error,
  };
};

export default useSignUp;
