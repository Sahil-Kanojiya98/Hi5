const LoadingSpinner = ({ size = "md", width = "24px", height = "24px" }) => {
  const sizeClass = `loading-${size}`;

  const spinnerStyle = {
    width,
    height,
  };

  return <span className={`loading loading-spinner ${sizeClass}`} style={spinnerStyle} />;
};

export default LoadingSpinner;
