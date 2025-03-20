import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/images/logo/Hi5.svg";
import { Link } from "react-router-dom";
import { toggleTheme } from "../../../redux/slices/themeSlice";
import { DarkMode, LightMode } from "@mui/icons-material";
import useLogout from "../../../hooks/useLogout";

const MobileHeader = () => {
  const user = useSelector((state) => state.user.profile);

  const logout = useLogout();

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <div className="md:hidden top-0 left-0 z-10 fixed bg-white dark:bg-black shadow-md w-full">
        <header className="flex justify-between items-center p-3">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Hi5 Logo" className="w-10 h-10" />
            <h1 className="font-lobster text-2xl">Hi5</h1>
          </div>
          {user?.role === "USER" && (
            <div className="flex justify-center items-center mr-1">
              <Link to={`/profile/${user.id}`}>
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="rounded-full w-8 h-8"
                />
              </Link>
            </div>
          )}
          {(user?.role === "MODERATOR" || user?.role === "ADMIN") && (
            <div className="flex gap-2">
              <button
                className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-800 p-2 rounded-md transition-all duration-300 cursor-pointer"
                onClick={changeThemeClickHandler}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <LightMode className="text-gray-200 transition-all duration-300" />
                ) : (
                  <DarkMode className="text-gray-800 dark:text-gray-200 transition-all duration-300" />
                )}
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 dark:hover:bg-red-800 dark:bg-red-700 px-4 py-2 rounded-md font-medium text-white transition-all duration-300"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </header>
      </div>
    </>
  );
};

export default MobileHeader;
