import React from "react";
import { Provider } from "react-redux";
import store from "../redux/store";

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
