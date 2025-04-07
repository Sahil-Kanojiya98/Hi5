import MobileNavbar from "./common/navbar/MobileNavbar";
import PropTypes from "prop-types";
import Sidebar from "./common/sidebar/SideBar";
import MobileHeader from "./common/header/MobileHeader";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 w-full h-screen">
      <MobileHeader />
      <Sidebar />
      {children}
      <MobileNavbar />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
