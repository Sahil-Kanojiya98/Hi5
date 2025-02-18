import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, label, link }) => (
  <li className="flex justify-center lg:justify-start items-center hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded cursor-pointer">
    <Link to={link} className="flex justify-center items-center text-xl">
      <span className="lg:mr-2">{icon}</span>
      <span className="lg:block hidden">{label}</span>
    </Link>
  </li>
);

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SidebarItem;
