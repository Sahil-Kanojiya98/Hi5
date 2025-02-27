import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MobileNavItem = ({ icon, link }) => (
  <Link to={link}>
    <div className="flex items-center hover:text-gray-400 text-2xl cursor-pointer">
      {icon}
    </div>
  </Link>
);

MobileNavItem.propTypes = {
  icon: PropTypes.element.isRequired,
  link: PropTypes.string.isRequired,
};

export default MobileNavItem;
