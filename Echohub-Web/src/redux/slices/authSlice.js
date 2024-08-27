import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
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
    }
  },
});

export const { addAuth , rmAuth } = authSlice.actions;
export default authSlice.reducer;
