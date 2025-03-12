import PropTypes from "prop-types";
import { Toaster, toast as t } from "react-hot-toast";
import { useEffect } from "react";
import { useWebSocket } from "../../socket/WebSocketProvider";
import { useSelector } from "react-redux";
import {
  Favorite,
  PostAdd,
  PlayCircle,
  Collections,
  Image,
  ChatBubble,
  CheckCircle,
  PersonAdd,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export const ToastProvider = ({ children }) => {
  const userId = useSelector((state) => state?.user?.profile?.id);
  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      let notificationSubscription;
      let chatSubscription;
      try {
        notificationSubscription = subscribeTopic(
          `/notification/${userId}`,
          (message) => {
            const msg = JSON.parse(message);
            const pathname = window.location.pathname;
            if (pathname == "/notifications") {
              return;
            }
            const type = msg?.type;
            switch (type) {
              case "NETWORK_NEW_POST":
              case "NETWORK_NEW_REEL":
              case "NETWORK_NEW_STORY":
                return NewContentNotification(type, msg?.username);
              case "LIKE_POST":
              case "LIKE_REEL":
              case "LIKE_STORY":
              case "LIKE_COMMENT":
                return LikeNotification(type, msg?.username);
              case "COMMENT_POST":
              case "COMMENT_REEL":
                return CommentNotification(type, msg?.username);
              case "FOLLOW":
              case "FOLLOW_REQUEST":
              case "FOLLOW_REQUEST_ACCEPT":
                return FollowNotification(type, msg?.username);
            }
          }
        );
        chatSubscription = subscribeTopic(`/chat/${userId}`, (message) => {
          const msg = JSON.parse(message);
          const pathname = window.location.pathname;
          if (pathname != `/chat/${msg.senderUserId}`) {
            MessageToast(msg);
          }
        });
      } catch (e) {
        console.log("error:" + e);
      }
      return () => {
        unsubscribeTopic(notificationSubscription);
        unsubscribeTopic(chatSubscription);
      };
    }
  }, [userId, isConnected, subscribeTopic, unsubscribeTopic]);

  return (
    <>
      {children}
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const GeneralToast = (data) => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm text-center">
          {data}
        </p>
      </div>
    </div>
  ));
};

export const PostCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <CheckCircle className="text-green-500 dark:text-green-400" />
      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
        Post Created Successfully!
      </p>
    </div>
  ));
};

export const ReelCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <CheckCircle className="text-blue-500 dark:text-blue-400" />
      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
        Reel Created Successfully!
      </p>
    </div>
  ));
};

export const StoryCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <CheckCircle className="text-purple-500 dark:text-purple-400" />
      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
        Story Added Successfully!
      </p>
    </div>
  ));
};

export const MessageToast = (messageData) => {
  t.custom((t) => (
    <Link to={`/chat/${messageData?.senderUserId}`}>
      <div
        className={`${
          t.visible ? "animate-toast-enter" : "animate-toast-leave"
        } max-w-xs w-[320px] bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black dark:ring-white ring-opacity-5 p-4`}
      >
        <div className="sm:hidden flex items-center space-x-2">
          <ChatBubble fontSize="small" className="text-blue-500" />
          <p className="text-gray-900 dark:text-gray-100 text-sm">
            New message from{" "}
            <span className="font-semibold">
              @{messageData?.senderUsername}
            </span>
          </p>
        </div>

        <div className="hidden sm:block w-full">
          <div className="flex items-center space-x-3">
            <img
              src={messageData?.senderProfileImageUrl}
              alt={`${messageData?.senderFullname}'s profile`}
              className="border rounded-full w-10 h-10"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {messageData?.senderFullname}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                @{messageData?.senderUsername}
              </p>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-gray-900 dark:text-gray-100 text-sm truncate">
              {messageData?.message.length > 50
                ? `${messageData?.message.substring(0, 50)}...`
                : messageData?.message}
            </p>
          </div>

          {(messageData?.imageUrl || messageData?.videoUrl) && (
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 mt-2">
                {messageData?.imageUrl && (
                  <div className="flex items-center space-x-1 text-blue-500">
                    <Image fontSize="small" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      Image
                    </span>
                  </div>
                )}
                {messageData?.videoUrl && (
                  <div className="flex items-center space-x-1 text-red-500">
                    <PlayCircle fontSize="small" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      Video
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  ));
};

export const LikeNotification = (type, username) => {
  t.custom((t) => (
    <Link to={"/notifications"}>
      <div
        className={`${
          t.visible ? "animate-toast-enter" : "animate-toast-leave"
        } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
      >
        <Favorite className="text-red-500 dark:text-red-400" />
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {username} {getLikeMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getLikeMessage = (type) => {
  switch (type) {
    case "LIKE_POST":
      return "liked your post.";
    case "LIKE_REEL":
      return "liked your reel.";
    case "LIKE_STORY":
      return "liked your story.";
    case "LIKE_COMMENT":
      return "liked your comment.";
    default:
      return "";
  }
};

export const CommentNotification = (type, username) => {
  t.custom((t) => (
    <Link to={"/notifications"}>
      <div
        className={`${
          t.visible ? "animate-toast-enter" : "animate-toast-leave"
        } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
      >
        <ChatBubble className="text-blue-500 dark:text-blue-400" />
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {username} {getCommentMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getCommentMessage = (type) => {
  switch (type) {
    case "COMMENT_POST":
      return "commented on your post.";
    case "COMMENT_REEL":
      return "commented on your reel.";
    default:
      return "";
  }
};

export const FollowNotification = (type, username) => {
  t.custom((t) => (
    <Link to={"/notifications"}>
      <div
        className={`${
          t.visible ? "animate-toast-enter" : "animate-toast-leave"
        } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
      >
        <PersonAdd className="text-green-500 dark:text-green-400" />
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {username} {getFollowMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getFollowMessage = (type) => {
  switch (type) {
    case "FOLLOW":
      return "started following you.";
    case "FOLLOW_REQUEST":
      return "sent you a follow request.";
    case "FOLLOW_REQUEST_ACCEPT":
      return "accepted your follow request."
    default:
      return "";
  }
};

export const NewContentNotification = (type, username) => {
  t.custom((t) => (
    <Link to={"/notifications"}>
      <div
        className={`${
          t.visible ? "animate-toast-enter" : "animate-toast-leave"
        } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex items-center gap-3 p-4 ring-1 ring-black dark:ring-white ring-opacity-5`}
      >
        {getIcon(type)}
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {username} {getContentMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getIcon = (type) => {
  switch (type) {
    case "NETWORK_NEW_POST":
      return <PostAdd className="text-gray-500 dark:text-gray-400" />;
    case "NETWORK_NEW_REEL":
      return <PlayCircle className="text-teal-500 dark:text-teal-400" />;
    case "NETWORK_NEW_STORY":
      return <Collections className="text-pink-500 dark:text-pink-400" />;
    default:
      return null;
  }
};

const getContentMessage = (type) => {
  switch (type) {
    case "NETWORK_NEW_POST":
      return "posted a new post.";
    case "NETWORK_NEW_REEL":
      return "uploaded a new reel.";
    case "NETWORK_NEW_STORY":
      return "shared a new story.";
    default:
      return "";
  }
};
