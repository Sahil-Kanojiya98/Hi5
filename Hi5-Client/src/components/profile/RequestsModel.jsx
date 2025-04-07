import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../services/axios.config";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

const RequestsModel = ({ isOpen, closeModal, type }) => {
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

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (type === "SENT") {
        const response = await axiosInstance.get("/user/follow/sent/requests", {
          params: {
            page,
            size: 10,
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setRequests((prevRequests) => [...prevRequests, ...response.data]);
        }
      } else if (type === "RECEIVED") {
        const response = await axiosInstance.get(
          "/user/follow/received/requests",
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
          setRequests((prevRequests) => [...prevRequests, ...response.data]);
        }
      } else {
        throw Error("Not Valid Type.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, type]);

  useEffect(() => {
    if (isOpen) {
      setRequests([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, page, fetchRequests, type]);

  const loadMoreRequests = useCallback(() => {
    console.log("load more requests");
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore, setPage]);

  if (!isOpen) return null;

  const cancelRequestHandler = async (userId) => {
    console.log("user id allow" + userId);
    try {
      const response = await axiosInstance.delete(
        `/user/follow/cancel/${userId}`
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Follow request canceled successfully!");
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== userId)
        );
      } else {
        toast.warn("Request processed, but check the response.");
      }
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleAllowClick = async (userId) => {
    console.log("user id allow" + userId);
    try {
      const response = await axiosInstance.post("/user/follow/allow", {
        userId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Follow request accepted successfully!");
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== userId)
        );
      } else {
        toast.warn("Request processed, but check the response.");
      }
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  const handleDenyClick = async (userId) => {
    console.log("user id deny" + userId);
    try {
      const response = await axiosInstance.post("/user/follow/deny", {
        userId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Follow request denied successfully.");
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== userId)
        );
      } else {
        toast.warn("Request processed, but check the response.");
      }
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <>
      <div
        className="z-20 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleOutsideClick}
      >
        <div
          className={`bg-white dark:bg-black border border-gray-500 shadow-lg p-4 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md transition-transform duration-300 transform ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex justify-between items-center mb-4 text-xl">
            {type === "SENT" && (
              <h3 className="font-semibold">Sent Requests</h3>
            )}
            {type === "RECEIVED" && (
              <h3 className="font-semibold">Received Requests</h3>
            )}

            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-100 dark:text-gray-300"
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: { xs: 25, sm: 28, md: 30 },
                }}
                className="text-gray-500 hover:text-red-500 transition duration-200"
              />
            </button>
          </div>
          <div className="mb-4 px-2 py-1 rounded-lg max-h-60 overflow-y-auto hide-scrollbar">
            <InfiniteScroll
              dataLength={requests.length}
              next={loadMoreRequests}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<p className="text-center">No more requests</p>}
            >
              {requests.map((user) => (
                <div
                  key={user?.id}
                  className="flex justify-between items-center gap-5 sm:gap-0 bg-white dark:bg-black p-3 rounded-lg transition"
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

                  {type === "SENT" && (
                    <div className="flex justify-center items-center gap-2 ml-auto">
                      <button
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-sm sm:text-base"
                        onClick={() => {
                          cancelRequestHandler(user?.id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {type === "RECEIVED" && (
                    <div className="flex justify-center items-center gap-2 ml-auto">
                      <button
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white text-sm sm:text-base"
                        onClick={() => {
                          handleAllowClick(user?.id);
                        }}
                      >
                        Allow
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-sm sm:text-base"
                        onClick={() => {
                          handleDenyClick(user?.id);
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </InfiniteScroll>
            {!isLoading && error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

RequestsModel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default RequestsModel;
