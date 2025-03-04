import { Link } from "react-router-dom";
import {
  Favorite,
  ChatBubble,
  PersonAdd,
  Email,
  Public,
  Notifications,
} from "@mui/icons-material";
import MainLayout from "../components/layout/MainLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios.config";
import DeleteConfirmationModal from "../components/temp/DeleteConfirmationModal";
import TimeAgo from "../components/temp/TimeAgo";
import { useWebSocket } from "../socket/WebSocketProvider";
import { useSelector } from "react-redux";

const NotificationsPage = () => {
  const userId = useSelector((state) => state?.user?.profile?.id);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      let notificationSubscription;
      try {
        notificationSubscription = subscribeTopic(
          `/notification/${userId}`,
          (message) => {
            const msg = JSON.parse(message);
            setNotifications((prev) => {
              return [msg, ...prev];
            });
          }
        );
      } catch (e) {
        console.log("error:" + e);
      }
      return () => {
        unsubscribeTopic(notificationSubscription);
      };
    }
  }, [userId, isConnected, subscribeTopic, unsubscribeTopic]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/notification", {
        params: {
          page,
          size: 10,
        },
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...response.data,
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setNotifications([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [page, fetchNotifications]);

  const loadMoreComments = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMoreComments]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => {
    if (notifications?.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete("/notification");
      console.log(response);
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting story: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const handleAllowClick = async (notificationId) => {
    await axiosInstance.post("/user/follow/allow", {
      notificationId,
    });
  };

  const handleDenyClick = async (notificationId) => {
    await axiosInstance.post(`/user/follow/deny`, {
      notificationId,
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case "LIKE_POST":
      case "LIKE_REEL":
      case "LIKE_STORY":
      case "LIKE_COMMENT":
        return <Favorite className="text-red-500" />;

      case "COMMENT_POST":
      case "COMMENT_REEL":
        return <ChatBubble className="text-blue-500" />;

      case "FOLLOW":
      case "FOLLOW_REQUEST":
        return <PersonAdd className="text-green-500" />;

      case "NETWORK_NEW_POST":
      case "NETWORK_NEW_REEL":
      case "NETWORK_NEW_STORY":
        return <Public className="text-purple-500" />;

      case "MESSAGE":
        return <Email className="text-yellow-500" />;

      default:
        return <Notifications className="text-gray-500" />;
    }
  };

  const getMsg = (type, username) => {
    switch (type) {
      case "LIKE_POST":
      case "LIKE_REEL":
      case "LIKE_STORY":
      case "LIKE_COMMENT":
        return `@${username} liked your ${type
          .replace("LIKE_", "")
          .toLowerCase()}`;

      case "COMMENT_POST":
      case "COMMENT_REEL":
        return `@${username} commented on your ${type
          .replace("COMMENT_", "")
          .toLowerCase()}`;

      case "FOLLOW":
        return `@${username} started following you`;

      case "FOLLOW_REQUEST":
        return `@${username} sent you a follow request`;

      case "NETWORK_NEW_POST":
      case "NETWORK_NEW_REEL":
      case "NETWORK_NEW_STORY":
        return `@${username} posted a new ${type
          .replace("NETWORK_NEW_", "")
          .toLowerCase()}`;

      default:
        return "You have a new notification";
    }
  };

  const getLink = (type, relevantId, userId) => {
    switch (type) {
      case "LIKE_POST":
      case "COMMENT_POST":
      case "NETWORK_NEW_POST":
        return (
          <Link
            to={`/shared/post/${relevantId}`}
            className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
          >
            View
          </Link>
        );
      case "LIKE_REEL":
      case "COMMENT_REEL":
      case "NETWORK_NEW_REEL":
        return (
          <Link
            to={`/share/reel/${relevantId}`}
            className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
          >
            View
          </Link>
        );
      case "LIKE_STORY":
      case "LIKE_COMMENT":
      case "FOLLOW":
      case "FOLLOW_REQUEST":
      case "NETWORK_NEW_STORY":
        return (
          <Link
            to={`/profile/${userId}`}
            className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
          >
            View
          </Link>
        );
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 dark:bg-gray-900 mx-auto p-4 pt-[60px] sm:pt-[80px] md:pt-[0px] md:pl-[70px] lg:pl-[260px] w-full hide-scrollbar">
        <div className="flex flex-col justify-center w-full max-w-3xl">
          <div className="top-0 z-10 sticky bg-white dark:bg-black shadow-md mt-1 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-2xl">
                Notifications
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-sm transition"
                onClick={openDeleteModal}
              >
                Remove All
              </button>
            </div>
          </div>

          <div className="space-y-4 sm:p-4 overflow-y-auto hide-scrollbar">
            {!isLoading && notifications.length > 0 && (
              <>
                {notifications.map((notification) => (
                  <>
                    <div
                      key={notification.id}
                      className="flex sm:flex-row flex-col justify-between items-start sm:gap-4 bg-white hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-black shadow-md p-4 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/profile/${notification?.userId}`}
                          className="rounded-full w-12 h-12 overflow-hidden avatar"
                        >
                          <img
                            src={notification.profilePictureUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="flex sm:flex-row flex-col gap-2 font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                              <div className="flex items-center gap-2">
                                {getIcon(notification.type)}
                                {notification.fullname}
                              </div>
                              <span className="font-normal text-gray-600 dark:text-gray-400">
                                {getMsg(
                                  notification.type,
                                  notification.username
                                )}
                              </span>
                            </p>

                            <p className="text-gray-500 text-xs sm:text-sm">
                              <TimeAgo date={notification.createdAt} />
                            </p>
                          </div>
                        </div>
                      </div>
                      {notification.type === "FOLLOW_REQUEST" ? (
                        <div className="flex gap-2 ml-auto">
                          <button
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white text-sm sm:text-base"
                            onClick={() => {
                              handleAllowClick(notification?.id);
                            }}
                          >
                            Allow
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white text-sm sm:text-base"
                            onClick={() => {
                              handleDenyClick(notification?.id);
                            }}
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <>
                          {getLink(
                            notification.type,
                            notification.relevantId,
                            notification?.userId
                          )}
                        </>
                      )}
                    </div>
                  </>
                ))}
                {!isLoading && error === null && (
                  <div
                    ref={loaderRef}
                    className="flex justify-center items-center h-11"
                  ></div>
                )}
                {!isLoading && error !== null && (
                  <div
                    ref={loaderRef}
                    className="flex justify-center items-center h-16 text-white"
                  >
                    Something error occured.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="NOTIFICATIONS"
      />
    </MainLayout>
  );
};

export default NotificationsPage;

// const notifications = [
//   {
//     id: 1,
//     username: "john_doe",
//     message: "liked your post",
//     time: "2h ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=1",
//   },
//   {
//     id: 2,
//     username: "jane_smith",
//     message: "liked your reel",
//     time: "4h ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=2",
//   },
//   {
//     id: 3,
//     username: "mike_brown",
//     message: "commented on your post",
//     time: "1d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=3",
//   },
//   {
//     id: 4,
//     username: "emma_white",
//     message: "shared your post",
//     time: "2d ago",
//     type: "share",
//     profileImage: "https://i.pravatar.cc/100?img=4",
//   },
//   {
//     id: 5,
//     username: "chris_black",
//     message: "wants to follow you",
//     time: "3d ago",
//     type: "follow",
//     profileImage: "https://i.pravatar.cc/100?img=5",
//   },
//   {
//     id: 6,
//     username: "alex_green",
//     message: "messaged you while you were offline",
//     time: "5h ago",
//     type: "message",
//     profileImage: "https://i.pravatar.cc/100?img=6",
//   },
//   {
//     id: 7,
//     username: "lisa_gray",
//     message: "commented on your reel",
//     time: "1d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=7",
//   },
//   {
//     id: 8,
//     username: "olivia_red",
//     message: "liked your story",
//     time: "3h ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=8",
//   },
//   {
//     id: 9,
//     username: "ethan_blue",
//     message: "started following you",
//     time: "6h ago",
//     type: "follow",
//     profileImage: "https://i.pravatar.cc/100?img=9",
//   },
//   {
//     id: 10,
//     username: "mia_yellow",
//     message: "liked your comment",
//     time: "8h ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=10",
//   },
//   {
//     id: 11,
//     username: "jacob_white",
//     message: "shared your reel",
//     time: "12h ago",
//     type: "share",
//     profileImage: "https://i.pravatar.cc/100?img=11",
//   },
//   {
//     id: 12,
//     username: "charlotte_black",
//     message: "commented on your story",
//     time: "1d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=12",
//   },
//   {
//     id: 13,
//     username: "aiden_brown",
//     message: "liked your post",
//     time: "2d ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=13",
//   },
//   {
//     id: 14,
//     username: "amelia_gray",
//     message: "wants to follow you",
//     time: "2d ago",
//     type: "follow",
//     profileImage: "https://i.pravatar.cc/100?img=14",
//   },
//   {
//     id: 15,
//     username: "oliver_purple",
//     message: "commented on your post",
//     time: "3d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=15",
//   },
//   {
//     id: 16,
//     username: "isabella_blue",
//     message: "liked your reel",
//     time: "4d ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=16",
//   },
//   {
//     id: 17,
//     username: "lucas_pink",
//     message: "shared your story",
//     time: "5d ago",
//     type: "share",
//     profileImage: "https://i.pravatar.cc/100?img=17",
//   },
//   {
//     id: 18,
//     username: "harper_silver",
//     message: "commented on your reel",
//     time: "6d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=18",
//   },
//   {
//     id: 19,
//     username: "ella_gold",
//     message: "liked your post",
//     time: "7d ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=19",
//   },
//   {
//     id: 20,
//     username: "jack_brown",
//     message: "wants to follow you",
//     time: "8d ago",
//     type: "follow",
//     profileImage: "https://i.pravatar.cc/100?img=20",
//   },
//   {
//     id: 21,
//     username: "sophia_green",
//     message: "commented on your story",
//     time: "9d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=21",
//   },
//   {
//     id: 22,
//     username: "liam_grey",
//     message: "liked your post",
//     time: "10d ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=22",
//   },
//   {
//     id: 23,
//     username: "emma_white",
//     message: "shared your post",
//     time: "11d ago",
//     type: "share",
//     profileImage: "https://i.pravatar.cc/100?img=23",
//   },
//   {
//     id: 24,
//     username: "olivia_red",
//     message: "commented on your reel",
//     time: "12d ago",
//     type: "comment",
//     profileImage: "https://i.pravatar.cc/100?img=24",
//   },
//   {
//     id: 25,
//     username: "ethan_blue",
//     message: "liked your post",
//     time: "13d ago",
//     type: "like",
//     profileImage: "https://i.pravatar.cc/100?img=25",
//   },
// ];
