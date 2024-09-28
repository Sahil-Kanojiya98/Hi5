import axios from "axios";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "../utils/localStorage";
import {
  getRefreshToken,
  removeRefreshToken,
  setRefreshToken,
} from "../utils/indexedDB";
import store from "../redux/store";
import { rmAuth } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("url:" + config.url);
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (response && response.status === 401) {
      const refreshTokenData = await getRefreshToken("refreshToken");
      if (refreshTokenData) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:8080/api/auth/refresh",
            {
              refreshToken: refreshTokenData.token,
            }
          );

          const { accessToken, refreshToken } = refreshResponse.data;
          console.log("set access token:" + accessToken);
          setAccessToken(accessToken);
          if (refreshToken) {
            console.log("set refresh token" + refreshToken);
            await setRefreshToken({ id: "refreshToken", token: refreshToken });
          }

          config.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance(config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          removeAccessToken();
          await removeRefreshToken("refreshToken");
          store.dispatch(rmAuth());
          //window.location.href = 'http://localhost:3000/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
