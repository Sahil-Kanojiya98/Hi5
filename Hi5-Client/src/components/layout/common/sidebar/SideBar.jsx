import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../assets/images/logo/Hi5.svg";
import SidebarItem from "./SidebarItem";
import useLogout from "../../../../hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import {
  AddCircleRounded,
  DashboardRounded,
  HomeRounded,
  MessageRounded,
  MoreVertRounded,
  NotificationsRounded,
  PeopleRounded,
  SearchRounded,
  Report,
  SupervisorAccountRounded,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { toggleTheme } from "../../../../redux/slices/themeSlice";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logout = useLogout();

  const user = useSelector((state) => state.user.profile);

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      {user?.role === "USER" && (
        <div className="hidden top-0 left-0 z-10 fixed md:flex flex-col justify-between md:items-center lg:items-start bg-white dark:bg-black p-4 md:w-20 lg:w-52 xl:w-64 h-full">
          <Link to="/" className="flex items-center space-x-3 mx-2 mt-3 mb-8">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="md:hidden lg:block font-lobster text-4xl">Hi5</p>
          </Link>

          <div className="space-y-4 md:mt-3 lg:mt-7 w-full">
            <SidebarItem
              icon={
                <HomeRounded
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
                <SearchRounded
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
                <AddCircleRounded
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
                <MessageRounded
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
                <NotificationsRounded
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
              <MoreVertRounded />
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
      )}

      {user?.role === "MODERATOR" && (
        <div className="hidden top-0 left-0 z-10 fixed md:flex flex-col justify-between md:items-center lg:items-start bg-white dark:bg-black p-4 md:w-20 lg:w-52 xl:w-64 h-full">
          <Link to="/" className="flex items-center space-x-3 mx-2 mt-3 mb-8">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="md:hidden lg:block font-lobster text-4xl">Hi5</p>
          </Link>
          <div className="space-y-4 md:mt-3 lg:mt-7 w-full">
            <SidebarItem
              icon={<Report sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Reports"
              link="/moderator/moderate/content"
            />
            <SidebarItem
              icon={
                <PeopleRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />
              }
              label="Users"
              link="/moderator/moderate/user"
            />
          </div>
          <div className="relative flex justify-between items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 my-4 mt-auto p-2 rounded-xl w-full">
            <div className="hidden lg:flex flex-col gap-1 pl-2">
              <span className="hidden lg:block w-20 xl:w-32 text-black dark:text-white text-sm truncate">
                Moderator
              </span>
            </div>
            <span
              className="hidden md:block text-2xl cursor-pointer"
              onClick={toggleModal}
            >
              <MoreVertRounded />
            </span>
            {isModalOpen && (
              <div
                className="hidden md:block bottom-11 lg:left-36 xl:left-48 z-50 absolute bg-white dark:bg-black shadow-lg p-2 rounded-md w-40"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="flex justify-between items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                  onClick={changeThemeClickHandler}
                  aria-label="Toggle theme"
                >
                  <p>Theme</p>
                  {theme === "dark" ? (
                    <LightMode className="block text-gray-200 transition-all duration-300" />
                  ) : (
                    <DarkMode className="block dark:text-gray-800 transition-all duration-300" />
                  )}
                </div>
                <div
                  className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                  onClick={logout}
                >
                  <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="hidden top-0 left-0 z-10 fixed md:flex flex-col justify-between md:items-center lg:items-start bg-white dark:bg-black p-4 md:w-20 lg:w-52 xl:w-64 h-full">
          <Link to="/" className="flex items-center space-x-3 mx-2 mt-3 mb-8">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="md:hidden lg:block font-lobster text-4xl">Hi5</p>
          </Link>

          <div className="space-y-4 md:mt-3 lg:mt-7 w-full">
            <SidebarItem
              icon={
                <DashboardRounded
                  sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }}
                />
              }
              label="Dashboard"
              link="/admin/dashboard"
            />
            <SidebarItem
              icon={<Report sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Reports"
              link="/admin/moderate/content"
            />
            <SidebarItem
              icon={
                <PeopleRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />
              }
              label="Users"
              link="/admin/moderate/user"
            />
            <SidebarItem
              icon={
                <SupervisorAccountRounded
                  sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }}
                />
              }
              label="Moderators"
              link="/admin/moderators"
            />
          </div>

          <div className="relative flex justify-between items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-800 my-4 mt-auto p-2 rounded-xl w-full">
            <div className="hidden lg:flex flex-col gap-1 pl-2">
              <span className="hidden lg:block w-20 xl:w-32 text-black dark:text-white text-sm truncate">
                Admin
              </span>
            </div>
            <span
              className="hidden md:block text-2xl cursor-pointer"
              onClick={toggleModal}
            >
              <MoreVertRounded />
            </span>
            {isModalOpen && (
              <div
                className="hidden md:block bottom-11 lg:left-36 xl:left-48 z-50 absolute bg-white dark:bg-black shadow-lg p-2 rounded-md w-40"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="flex justify-between items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                  onClick={changeThemeClickHandler}
                  aria-label="Toggle theme"
                >
                  <p>Theme</p>
                  {theme === "dark" ? (
                    <LightMode className="block text-gray-200 transition-all duration-300" />
                  ) : (
                    <DarkMode className="block dark:text-gray-800 transition-all duration-300" />
                  )}
                </div>
                <div
                  className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md cursor-pointer"
                  onClick={logout}
                >
                  <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
