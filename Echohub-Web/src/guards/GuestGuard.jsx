import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Preloader from "../components/Preloader";

const GuestGuard = ({ children }) => {
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  console.log(
    user?.roles.includes("ROLE_ADMIN") == true
      ? "admin redirecting "
      : "home redirecting"
  );
  if (isInitializing) {
    return <Preloader />;
  }
  return !isAuthenticated ? (
    children
  ) : user?.roles.includes("ROLE_ADMIN") ? (
    <Navigate to="/admin" />
  ) : (
    <Navigate to="/home" />
  );
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;
