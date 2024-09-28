// AuthProvider.js

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAuth, rmAuth } from "../redux/slices/authSlice";
import axiosInstance from "../utils/axiosConfig";
import { getAccessToken, removeAccessToken } from "../utils/localStorage";
import { getRefreshToken, removeRefreshToken } from "../utils/indexedDB";
import PropTypes from 'prop-types';

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  //comment it
  // setTimeout(async() => {
  //   dispatch(rmAuth());
  //   removeAccessToken();
  //   await removeRefreshToken("refreshToken");
  // }, 5000);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshTokenData = await getRefreshToken("refreshToken");
        console.table({ accessToken, refreshTokenData });
        if (accessToken && refreshTokenData.token ) {
          const res = await axiosInstance.get("/user/get-me");
          if (res.status === 200) {
            const userData = res.data;
            dispatch(
              addAuth({
                isAuthenticated: true,
                user: userData,
              })
            );
          } else {
            throw new Error("invalid token");
          }
        } else {
          throw new Error("token not found");
        }
      } catch (e) {
        console.error("Error while checking token validity", e);
        dispatch(rmAuth());
        removeAccessToken();
        await removeRefreshToken('refreshToken');
      }
    };
    checkTokenValidity();
  }, [dispatch]);
  return <>{children}</>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
