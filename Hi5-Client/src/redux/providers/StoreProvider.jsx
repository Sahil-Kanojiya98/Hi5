import PropTypes from "prop-types";
import { Provider } from "react-redux";
import store from "../store";

const StoreProvider = ({ children }) => {
  console.log("StoreProvider");
  return <Provider store={store}>{children}</Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreProvider;
