import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MobileNavItem = ({ icon, link }) => (
  <Link to={link}>
    <li className="flex items-center text-2xl hover:text-gray-400 cursor-pointer">
      {icon}
    </li>
  </Link>
);

MobileNavItem.propTypes = {
  icon: PropTypes.element.isRequired,
  link: PropTypes.string.isRequired,
};

export default MobileNavItem;
