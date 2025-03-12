import { useSelector } from "react-redux";
import logo from "../../../assets/images/logo/Hi5.svg";
import { Link } from "react-router-dom";

const MobileHeader = () => {
  
  const user = useSelector((state) => state.user.profile);

  return (
    <>
      <div className="md:hidden top-0 left-0 z-10 fixed bg-white dark:bg-black shadow-md w-full">
        <header className="flex justify-between items-center p-3">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Hi5 Logo" className="w-10 h-10" />
            <h1 className="font-lobster text-2xl">Hi5</h1>
          </div>
          <div className="flex justify-center items-center mr-1">
            <Link to={`/profile/${user.id}`}>
              <img
                src={user.profilePictureUrl}
                alt="Profile"
                className="rounded-full w-8 h-8"
              />
            </Link>
          </div>
        </header>
      </div>
    </>
  );
};

export default MobileHeader;
