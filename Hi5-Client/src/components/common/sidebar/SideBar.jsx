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
    <div className="hidden top-0 left-0 fixed md:flex flex-col justify-between md:items-center lg:items-start bg-white dark:bg-black p-4 md:w-20 lg:w-52 xl:w-64 h-full">
      <Link to="/" className="flex items-center space-x-3 mx-2 mt-3 mb-8">
        <img src={logo} alt="Logo" className="w-10" />
        <p className="md:hidden lg:block font-lobster text-4xl">Hi5</p>
      </Link>

      <div className="space-y-4 md:mt-3 lg:mt-7 w-full">
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
      </div>

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
            <span className="hidden lg:block w-20 xl:w-32 text-xs truncate">
              {user.fullname}
            </span>
            <span className="hidden lg:block w-20 xl:w-32 text-gray-400 text-sm truncate">
              @{user.username}
            </span>
          </div>
        </div>
        <span
          className="hidden lg:block text-2xl cursor-pointer"
          onClick={toggleModal}
        >
          <MoreVertRoundedIcon />
        </span>

        {isModalOpen && (
          <div className="hidden lg:block bottom-11 lg:left-36 xl:left-48 z-50 absolute bg-white dark:bg-black shadow-lg p-2 rounded-md w-40">
            <div className="flex flex-col">
              <Link to="/settings">
                <div className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer">
                  Settings
                </div>
              </Link>
              <div
                className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                onClick={logout}
              >
                <p>Logout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
