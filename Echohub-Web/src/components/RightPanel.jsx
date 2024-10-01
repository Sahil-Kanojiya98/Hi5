import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import RightPanelSkeleton from "./skeletons/RightPanelSkeleton";
import axiosInstance from "../utils/axiosConfig";

const RightPanel = ({ authUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    if (authUser.roles.includes("ROLE_ADMIN")) {
      setIsLoading(false); // Directly set loading to false if it's admin
      return;
    }
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axiosInstance.get("/user/suggest");
        console.log(response.data);
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestedUsers();
  }, [authUser.roles]);

  if (authUser.roles.includes("ROLE_ADMIN")) {
    return null;
  }

  if (!isLoading && suggestedUsers?.length === 0) {
    return <div className="md:w-72 w-0"></div>;
  }

  return (
    <div className="hidden lg:block my-3 mx-3 w-72">
      <div className="bg-[#16181C] p-3 rounded-md sticky top-2">
        <p className="font-bold mb-2">You might know</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <div
                className="flex items-center justify-between gap-4"
                key={user?.id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={
                          user?.profilePictureUrl
                            ? `http://localhost:8080${user?.profilePictureUrl}`
                            : "/avatar.png"
                        }
                        alt="Profile"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-24">
                      {user?.fullname}
                    </span>
                    <span className="text-sm text-slate-500 truncate w-20">
                      @{user?.username}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

RightPanel.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string,
    username: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    profilePictureUrl: PropTypes.string,
  }),
};

export default RightPanel;
