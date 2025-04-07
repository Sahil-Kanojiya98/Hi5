import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import TimeAgo from "../common/TimeAgo";
import axiosInstance from "../../services/axios.config";

const StoryViewUsersModal = ({ isOpen, closeModal, type, storyId }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (type === "STORY_LIKES") {
        const response = await axiosInstance.get(
          `/story/user/like/${storyId}`,
          {
            params: {
              page,
              size: 10,
            },
          }
        );
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data]);
        }
      } else if (type === "STORY_VIEWS") {
        const response = await axiosInstance.get(
          `/story/user/views/${storyId}`,
          {
            params: {
              page,
              size: 10,
            },
          }
        );
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data]);
        }
      } else {
        throw Error("Not Valid Type.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, type, storyId]);

  useEffect(() => {
    if (isOpen) {
      setUsers([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      setIsLoading(true);
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, page, fetchRequests, type]);

  const loadMoreUsers = useCallback(() => {
    console.log("load more requests");
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore, setPage]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleOutsideClick}
      >
        <div
          className={`bg-white dark:bg-gray-900 shadow-lg p-4 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md transition-transform duration-300 transform ${isOpen ? "scale-100" : "scale-95"
            }`}
        >
          <div className="flex justify-between items-center mb-4 text-xl">
            <h3 className="font-semibold">Users</h3>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-100 dark:text-gray-300"
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: { xs: 25, sm: 28, md: 30 },
                }}
              />
            </button>
          </div>
          <div className="mb-4 px-2 py-1 rounded-lg max-h-60 overflow-y-auto hide-scrollbar">
            {users.length === 0 && !isLoading && !error && (
              <p className="text-center">No users found.</p>
            )}
            {users.length > 0 && (
              <InfiniteScroll
                dataLength={users.length}
                next={loadMoreUsers}
                hasMore={hasMore}
                loader={<></>}
                endMessage={<p className="text-center">No more users</p>}
              >
                {users.map((user) => (
                  <div
                    key={user?.id}
                    className="flex justify-between items-center gap-5 sm:gap-0 bg-white dark:bg-black p-3 rounded-lg transition"
                  >
                    <div className="flex justify- items-center gap-1 min-[410px]:gap-4 transition duration-150">
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
                    {
                      type === "STORY_LIKES" && <TimeAgo date={user?.createdAt} />
                    }
                  </div>
                ))}
              </InfiniteScroll>
            )}
            {!isLoading && error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

StoryViewUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  storyId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default StoryViewUsersModal;