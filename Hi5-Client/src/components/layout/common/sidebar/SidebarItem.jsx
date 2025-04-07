import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, label, link }) => (
  <Link
    to={link}
    className="flex justify-center lg:justify-start items-center hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded cursor-pointer"
  >
    <div className="flex justify-center items-center text-xl">
      <span className="lg:mr-2">{icon}</span>
      <span className="hidden lg:block">{label}</span>
    </div>
  </Link>
);

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SidebarItem;
