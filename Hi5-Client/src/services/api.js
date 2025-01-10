import axiosInstance from "./axios.config";

const checkEmail = async (body) => {
  return axiosInstance.post("/auth/check-email", body);
};

const checkUsername = async (body) => {
  return axiosInstance.post("/auth/check-username", body);
};

const register = async (body) => {
  return axiosInstance.post("/auth/register", body);
};

const registerVerifyOtp = async (otp, body) => {
  return axiosInstance.post(`/auth/register/${otp}`, body);
};

const activateUser = async (token, body) => {
  return axiosInstance.post("/auth/activate", body, {
    headers: {
      IdentificationToken: token,
    },
  });
};

const getMe = async () => {
  return axiosInstance.get("/user/get-me");
};

const login = async (body) => {
  return axiosInstance.post("/auth/login", body);
};

const loginVerifyOTP = async (otp, token) => {
  return axiosInstance.post(`/auth/login/${otp}`, null, {
    headers: {
      IdentificationToken: token,
    },
  });
};

const forgotPassword = async (body) => {
  return axiosInstance.post("/auth/forget-password", body);
};

const forgotPasswordVerifyOTP = async (otp,body)=>{
  return axiosInstance.post(`/auth/forget-password/${otp}`,body);
}

export {
  checkEmail,
  checkUsername,
  register,
  registerVerifyOtp,
  activateUser,
  getMe,
  login,
  loginVerifyOTP,
  forgotPassword,
  forgotPasswordVerifyOTP,
};
