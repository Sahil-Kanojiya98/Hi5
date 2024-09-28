import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isInitializing: true,
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    addAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isInitializing = false;
      state.user = action.payload.user;
    },
    rmAuth: (state) => {
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.user = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { addAuth, rmAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
