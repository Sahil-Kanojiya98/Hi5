import React, { useState, useEffect, useRef } from "react";
import { getMessagesByChatId } from "../../services/api";
import { useWebSocket } from "../../socket/WebSocketProvider";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ChatBox = ({ chatId, receiverId }) => {
  const { publish } = useWebSocket();
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");

  const myId = useSelector((state) => state?.user?.profile?.id);
  
  // const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();
  // useEffect(() => {
  //   if (isConnected) {
  //     const topic = `/message/${myId}/${receiverId}`;
  //     try {
  //       subscribeTopic(topic, (message) => {
  //         const msg = JSON.parse(message);
  //         console.log(msg);
  //       });
  //     } catch (e) {
  //       console.log("error:" + e);
  //     }
  //     return () => {
  //       unsubscribeTopic(topic);
  //     };
  //   }
  // }, [myId, isConnected, subscribeTopic, unsubscribeTopic]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    publish("/app/message", {
      chatId,
      message,
      senderId: myId,
      receiverId,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: "1",
        chatId,
        imageUrl: "",
        videoUrl: "",
        message,
        createdByUserId: myId,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage("");
  };

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        setIsMessagesLoading(true);
        const response = await getMessagesByChatId(chatId);
        setMessages(response.data);
      } catch (e) {
        setError(e);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col flex-1 gap-1 bg-gray-300 dark:bg-gray-700 p-4 rounded-lg max-h-[calc(100dvh-195px)] overflow-y-auto hide-scrollbar">
        {!chatId && (
          <p className="text-gray-400 text-center">
            Select a user to start chatting.
          </p>
        )}
        {isMessagesLoading && (
          <p className="text-gray-400 text-center">Loading...</p>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {chatId &&
          !isMessagesLoading &&
          !error &&
          (messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index}>
                {/* <div className="flex justify-center">
                        <div className="bg-gray-400 dark:bg-gray-600 bg-opacity-10 px-3 py-1 rounded-lg max-w-xs text-sm">
                          <p className="font-medium">1-10-2025</p>
                        </div>
                      </div> */}
                <div
                  className={`flex ${
                    msg?.createdByUserId === myId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      msg?.createdByUserId === myId
                        ? "bg-blue-400 dark:bg-blue-600"
                        : "bg-gray-400 dark:bg-gray-600"
                    } max-w-xs`}
                  >
                    <p className="font-medium">{msg.message}</p>
                    <span className="block mt-1 text-gray-300 text-xs">
                      {extractTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              No messages yet. Say hi!
            </p>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              chatId ? "Type a message" : "Select a user to start chatting"
            }
            className="flex-1 bg-gray-300 dark:bg-gray-700 p-3 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!chatId && isMessagesLoading}
          />
          <button
            onClick={handleSendMessage}
            className={`px-6 sm:px-3 lg:px-6 py-3 rounded-lg text-white transition-all hover:scale-105 ${
              chatId
                ? "bg-blue-400 dark:bg-blue-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!chatId || isMessagesLoading}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

ChatBox.propTypes = {
  chatId: PropTypes.string,
  receiverId: PropTypes.string,
};

const extractTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export default React.memo(ChatBox);
