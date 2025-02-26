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
  return axiosInstance.post(`/auth/register/${encodeURIComponent(otp)}`, body);
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
  return axiosInstance.post(`/auth/login/${encodeURIComponent(otp)}`, null, {
    headers: {
      IdentificationToken: token,
    },
  });
};

const forgotPassword = async (body) => {
  return axiosInstance.post("/auth/forget-password", body);
};

const forgotPasswordVerifyOTP = async (otp, body) => {
  return axiosInstance.post(
    `/auth/forget-password/${encodeURIComponent(otp)}`,
    body
  );
};

const deletePost = async (postId) => {
  return axiosInstance.delete(`/post/${encodeURIComponent(postId)}`);
};

const deleteReel = async (reelId) => {
  return axiosInstance.delete(`/reel/${encodeURIComponent(reelId)}`);
};

const deleteStory = async (storyId) => {
  return axiosInstance.delete(`/story/${encodeURIComponent(storyId)}`);
};

const deleteComment = async (commentId) => {
  return axiosInstance.delete(`/comment/${encodeURIComponent(commentId)}`);
};

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

const getUserProfile = async (userId) => {
  return axiosInstance.get(`/user/${userId}`);
};

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

const reportEntity = async (body) => {
  return axiosInstance.post("/report", body);
};

const getMyStorys = async () => {
  return axiosInstance.get("/story/my");
};

const searchUsersByKeyword = async (keyword, body) => {
  return axiosInstance.get(`/user/search/${encodeURIComponent(keyword)}`, {
    params: body,
  });
};

const createChat = async (userId) => {
  return axiosInstance.post(`/chat/${userId}`);
};

const getMyChats = async () => {
  return axiosInstance.get("/chat");
};

const getMessagesByChatId = async (chatId) => {
  return axiosInstance.get(`/message/${chatId}`);
};

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
  deletePost,
  deleteReel,
  deleteStory,
  deleteComment,
  save,
  unsave,
  // getSharedPost,
  getUserProfile,
  makeComment,
  likeEntity,
  unlikeEntity,
  reportEntity,
  getMyStorys,
  searchUsersByKeyword,
  getMyChats,
  createChat,
  getMessagesByChatId,
};
