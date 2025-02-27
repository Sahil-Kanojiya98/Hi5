import PropTypes from "prop-types";
import { Toaster, toast as t } from "react-hot-toast";
import { useEffect } from "react";
import { useWebSocket } from "../../socket/WebSocketProvider";
import { useSelector } from "react-redux";
import { Image, PlayCircle, ChatBubble } from "@mui/icons-material";
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
            console.log(msg);
            GeneralToast(message);
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
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm text-center">
          Post Created Successfully!
        </p>
      </div>
    </div>
  ));
};

export const ReelCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm text-center">
          Reel Created Successfully!
        </p>
      </div>
    </div>
  ));
};

export const StoryCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-toast-enter" : "animate-toast-leave"
      } w-max bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black dark:ring-white ring-opacity-5`}
    >
      <div className="flex-1 p-4 w-">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm text-center">
          Story Added Successfully!
        </p>
      </div>
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
