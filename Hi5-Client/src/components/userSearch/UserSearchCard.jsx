import {
  PersonAdd,
  CheckCircle,
  HourglassEmpty,
  Email,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { follow, unfollow } from "../../services/api";
import PropTypes from "prop-types";

const UserSearchCard = ({ user }) => {
  const myId = useSelector((state) => state?.user?.profile?.id);

  const [followStatus, setFollowStatus] = useState(user?.followStatus);

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === "FOLLOWED") {
      try {
        const response = await unfollow(user?.id);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "NOT_FOLLOWED") {
      try {
        const response = await follow(user?.id);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "REQUEST_SENT") {
      console.log("already request sent");
    } else {
      console.log("Invalid Status");
    }
  };

  return (
    <>
      <div
        key={user?.id}
        className="flex justify-between items-center gap-5 sm:gap-0 bg-white dark:bg-black shadow-md dark:shadow-gray-900 p-3 rounded-lg transition"
      >
        <div className="flex items-center gap-1 min-[410px]:gap-4 transition duration-150">
          <Link to={`/profile/${user?.id}`}>
            <div className="rounded-full w-10 min-[410px]:w-12 h-10 min-[410px]:h-12 overflow-hidden">
              <img
                src={user?.profilePictureUrl}
                alt={`${user?.fullname}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div>
            <p className="font-semibold min-[410px]:text-md text-sm md:text-lg break-normal whitespace-nowrap">
              {user?.fullname}
            </p>
            <p className="text-gray-400 text-sm break-normal whitespace-nowrap">
              @{user?.username}
            </p>
          </div>
        </div>
        {user?.id != myId && (
          <div className="flex gap-1 min-[410px]:gap-2">
            <button
              onClick={followStatusClickHandler}
              className={`flex items-center gap-2 min-[410px]:px-4  px-2 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md
                ${
                  followStatus === "FOLLOWED"
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
                ${
                  followStatus === "NOT_FOLLOWED"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : ""
                }
                ${
                  followStatus === "REQUEST_SENT"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : ""
                }
            `}
            >
              {followStatus === "FOLLOWED" && (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Following</span>
                </>
              )}
              {followStatus === "NOT_FOLLOWED" && (
                <>
                  <PersonAdd className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Follow</span>
                </>
              )}
              {followStatus === "REQUEST_SENT" && (
                <>
                  <HourglassEmpty className="w-5 h-5 text-white" />
                  <span className="hidden md:inline">Requested</span>
                </>
              )}
            </button>

            <Link
              to={`/chat/${user?.id}`}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 shadow-mdflex px-2 min-[410px]:px-4 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 transform"
            >
              <Email />
              <span className="hidden md:inline">Message</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

UserSearchCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string,
    followStatus: PropTypes.oneOf(["FOLLOWED", "NOT_FOLLOWED", "REQUEST_SENT"]),
  }).isRequired,
};

export default UserSearchCard;
