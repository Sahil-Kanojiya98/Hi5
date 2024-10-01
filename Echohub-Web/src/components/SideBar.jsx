import PropTypes from "prop-types";
import { MdHomeFilled } from "react-icons/md";
import { FaBookmark, FaSearch, FaUser } from "react-icons/fa";
import { AiOutlineDashboard, AiOutlineUsergroupAdd } from "react-icons/ai";
import { RiPagesLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Echohub from "./logo/Echohub";
import useLogout from "../hooks/useLogout";

const Sidebar = ({ authUser }) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const isAdmin = authUser?.roles.includes("ROLE_ADMIN");

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52 sticky">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-15 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start mt-3">
          <Echohub classNames="px-2 hidden md:block md:text-3xl rounded-full" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          {isAdmin ? (
            <>
              <li className="flex justify-center md:justify-start">
                <Link
                  to="/admin/dashboard"
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <AiOutlineDashboard className="w-6 h-6" />
                  <span className="text-lg hidden md:block">Dashboard</span>
                </Link>
              </li>
              <li className="flex justify-center md:justify-start">
                <Link
                  to="/admin/content-management"
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <RiPagesLine className="w-6 h-6" />
                  <span className="text-lg hidden md:block">
                    Content Management
                  </span>
                </Link>
              </li>
              <li className="flex justify-center md:justify-start">
                <Link
                  to="/admin/user-management"
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <AiOutlineUsergroupAdd className="w-6 h-6" />
                  <span className="text-lg hidden md:block">
                    User Management
                  </span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex justify-center md:justify-start">
                <Link
                  to="/"
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <MdHomeFilled className="w-8 h-8" />
                  <span className="text-lg hidden md:block">Home</span>
                </Link>
              </li>
              <li className="flex justify-center md:justify-start">
                <Link
                  to={`/profile/${authUser?.id}`}
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <FaUser className="w-6 h-6" />
                  <span className="text-lg hidden md:block">Profile</span>
                </Link>
              </li>
              <li className="flex justify-center md:justify-start">
                <Link
                  to={`/search`}
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <FaSearch className="w-6 h-6" />
                  <span className="text-lg hidden md:block">Search</span>
                </Link>
              </li>
              <li className="flex justify-center md:justify-start">
                <Link
                  to={`/saved`}
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-2 md:pr-4 max-w-fit cursor-pointer"
                >
                  <FaBookmark className="w-6 h-6" />
                  <span className="text-lg hidden md:block">Saved</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        {authUser && !isAdmin && (
          <Link
            to={`/profile/${authUser.id}`}
            className="mt-auto mb-10 flex gap-2 transition-all duration-300 hover:bg-[#181818] px-4 rounded-full items-center"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={
                    authUser?.profilePictureUrl
                      ? "http://localhost:8080" + authUser?.profilePictureUrl
                      : "/avatar.png"
                  }
                />
              </div>
            </div>
            <div className="flex justify-between flex-1 items-center">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-24 truncate">
                  {authUser?.fullname}
                </p>
                <p className="text-slate-500 font-bold text-sm w-24 overflow-hidden text-ellipsis whitespace-nowrap">
                  @{authUser?.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 scale-125 cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  await logout();
                  navigate("/login");
                }}
              />
            </div>
          </Link>
        )}

        {authUser && isAdmin && (
          <div className="mt-auto mb-10 flex gap-2 transition-all duration-300 hover:bg-[#181818] px-4 rounded-full items-center">
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={
                    authUser?.profilePictureUrl
                      ? "http://localhost:8080" + authUser?.profilePictureUrl
                      : "/avatar.png"
                  }
                />
              </div>
            </div>
            <div className="flex justify-between flex-1 items-center">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-24 truncate">
                  {authUser?.fullname}
                </p>
                <p className="text-slate-500 font-bold text-sm w-24 overflow-hidden text-ellipsis whitespace-nowrap">
                  @{authUser?.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 scale-125 cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  await logout();
                  navigate("/login");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Define PropTypes
Sidebar.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Sidebar;
