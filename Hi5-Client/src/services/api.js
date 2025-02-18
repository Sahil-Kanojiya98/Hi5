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

const forgotPasswordVerifyOTP = async (otp, body) => {
  return axiosInstance.post(`/auth/forget-password/${otp}`, body);
};

// const deletePost = async (postId) => {
//   return axiosInstance.delete(`/post/${postId}`);
// };

// const reportPost = async (body) => {
//   return axiosInstance.post("/report", body);
// };

// const likePost = async (postId) => {
//   return axiosInstance.post(`/post/${postId}/like`);
// };

// const unlikePost = async (postId) => {
//   return axiosInstance.delete(`/like/${postId}/like`);
// };

const save = async (body) => {
  return axiosInstance.post("/save", body);
};

const unsave = async (body) => {
  return axiosInstance.delete("/save", {
    params: body,
  });
};

// const getSharedPost = async (postId) => {
//   return axiosInstance.get(`/shared/post?postId=${postId}`);
// };

// const getUserProfile = async (userId) => {
//   return axiosInstance.get(`/user/${userId}`);
// };

const makeComment = async (body) => {
  return axiosInstance.post("/comment", body);
};

const likeEntity = async (body) => {
  return axiosInstance.post("/like", body);
};

const unlikeEntity = async (body) => {
  return axiosInstance.delete("/like", {
    params: body,
  });
};

const reportEntity = async (body)=>{
  return axiosInstance.post("/report", body);
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
  // deletePost,
  // reportPost,
  // likePost,
  // unlikePost,
  save,
  unsave,
  // getSharedPost,
  // getUserProfile,
  makeComment,
  likeEntity,
  unlikeEntity,
  reportEntity,
};
