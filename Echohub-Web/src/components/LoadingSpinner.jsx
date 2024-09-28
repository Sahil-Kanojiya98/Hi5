import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "md", width = "24px", height = "24px" }) => {
  const sizeClass = `loading-${size}`;

  const spinnerStyle = {
    width,
    height,
  };

  return <span className={`loading loading-spinner ${sizeClass}`} style={spinnerStyle} />;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]), // Restrict size to specific values
  width: PropTypes.string, // Expect width to be a string
  height: PropTypes.string, // Expect height to be a string
};

export default LoadingSpinner;
