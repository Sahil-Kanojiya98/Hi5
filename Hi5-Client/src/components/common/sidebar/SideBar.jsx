import { useState } from "react";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo/Hi5.svg";
import SidebarItem from "./SidebarItem";
import useLogout from "../../../hooks/useLogout";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logout = useLogout();

  const user = useSelector((state) => state.user.profile);

  return (
    <div className="top-0 left-0 fixed md:flex flex-col justify-between md:items-center lg:items-start hidden bg-white dark:bg-black p-4 md:w-20 lg:w-52 xl:w-64 h-full">
      <Link to="/" className="flex items-center space-x-3 mx-2 mt-3 mb-8">
        <img src={logo} alt="Logo" className="w-10" />
        <p className="lg:block md:hidden font-lobster text-4xl">Hi5</p>
      </Link>

      <ul className="space-y-4 md:mt-3 lg:mt-7 w-full">
        <SidebarItem
          icon={
            <HomeRoundedIcon
              sx={{
                fontSize: { xs: 20, sm: 30, md: 35 },
              }}
            />
          }
          label="Home"
          link="/home"
        />
        <SidebarItem
          icon={
            <SearchRoundedIcon
              sx={{
                fontSize: { xs: 20, sm: 30, md: 35 },
              }}
            />
          }
          label="Search"
          link="/search"
        />
        <SidebarItem
          icon={
            <AddCircleRoundedIcon
              sx={{
                fontSize: { xs: 20, sm: 30, md: 35 },
              }}
            />
          }
          label="Reels"
          link="/reels"
        />
        <SidebarItem
          icon={
            <MessageRoundedIcon
              sx={{
                fontSize: { xs: 20, sm: 30, md: 35 },
              }}
            />
          }
          label="Messages"
          link="/chat"
        />
        <SidebarItem
          icon={
            <NotificationsRoundedIcon
              sx={{
                fontSize: { xs: 20, sm: 30, md: 35 },
              }}
            />
          }
          label="Notifications"
          link="/notifications"
        />
      </ul>

      <div className="relative flex justify-between items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 my-4 mt-auto p-2 rounded-xl w-full">
        <div className="flex justify-center items-center lg:gap-2">
          <Link to={`/profile/${user.id}`}>
            <img
              src={user.profilePictureUrl}
              alt={`${user.username}'s profile image`}
              className="rounded-full w-8 lg:w-10 h-8 lg:h-10"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <span className="lg:block hidden w-20 xl:w-32 text-xs truncate">
              {user.fullname}
            </span>
            <span className="lg:block hidden w-20 xl:w-32 text-gray-400 text-sm truncate">
              @{user.username}
            </span>
          </div>
        </div>
        <span
          className="lg:block hidden text-2xl cursor-pointer"
          onClick={toggleModal}
        >
          <MoreVertRoundedIcon />
        </span>

        {isModalOpen && (
          <div className="lg:block bottom-11 lg:left-36 xl:left-48 z-50 absolute hidden bg-white dark:bg-black shadow-lg p-2 rounded-md w-40">
            <ul className="flex flex-col">
              <li className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                <Link to="/settings">Settings</Link>
              </li>
              <li
                className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                onClick={logout}
              >
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
