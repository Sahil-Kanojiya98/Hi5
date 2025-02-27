import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import {
  createChat,
  deleteMessagesByChatId,
  getMyChats,
} from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useWebSocket } from "../socket/WebSocketProvider";
import ChatBox from "../components/chat/ChatBox";
import { MoreVertRounded } from "@mui/icons-material";
import DeleteConfirmationModal from "../components/temp/DeleteConfirmationModal";

const ChatPage = () => {
  const myId = useSelector((state) => state?.user?.profile?.id);
  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  const navigate = useNavigate();
  const { userId } = useParams();
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  const handleCreateChat = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await createChat(userId);
      console.log("Chat Created:", response);
      return response;
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setChatLoading(true);
    try {
      if (userId) {
        await handleCreateChat();
      }
      const response = await getMyChats();
      setChats(response.data);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setChatLoading(false);
    }
  }, [userId, handleCreateChat]);

  useEffect(() => {
    loadData();
  }, [userId, loadData]);

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (isConnected) {
      let subscription;
      try {
        subscription = subscribeTopic(`/presence/${myId}`, (message) => {
          const newData = JSON.parse(message);
          setChats((prevChats) =>
            prevChats.map((chat) => ({
              ...chat,
              receiverStatus: newData[chat.receiverId] || "OFFLINE",
            }))
          );
        });
      } catch (e) {
        console.log("error:" + e);
      }
      return () => {
        unsubscribeTopic(subscription);
      };
    }
  }, [myId, isConnected, subscribeTopic, unsubscribeTopic]);

  useEffect(() => {
    setSelectedChat(chats.find((chat) => chat.receiverId === userId));
  }, [setSelectedChat, chats, userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
  };
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMessagesByChatId(selectedChat?.chatId);
      console.log("messages deleted");
    } catch (error) {
      console.error("Error deleting messages: ", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
      setIsModalOpen(false);
      navigate("/chat");
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center md:ml-[14dvw] lg:ml-[13dvw] xl:ml-[19dvw] 2xl:ml-[10dvw] w-full md:max-w-4xl xl:max-w-5xl h-full">
        <div className="p-3 lg:w-1/3 h-full">
          <div className="bg-white dark:bg-black p-4 rounded-lg w-full h-full">
            <div className="flex justify-between items-center gap-6 mb-7">
              <h2 className="font-bold text-xl">Users</h2>
              <div className="flex items-center gap-1">
                <Link to="/search">
                  <button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-lg text-white whitespace-nowrap transition-all">
                    Search Users
                  </button>
                </Link>
                <Link to="/chat">
                  <button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-lg text-white whitespace-nowrap transition-all">
                    New Chats
                  </button>
                </Link>
              </div>
            </div>

            <ul className="rounded-md h-[calc(100dvh-100px)] overflow-y-auto hide-scrollbar">
              {chatLoading ? (
                <p className="pt-4 text-slate-500 text-center">Loading...</p>
              ) : (
                <>
                  {chats.length > 0 ? (
                    <>
                      {chats.map((chat) => (
                        <li
                          key={chat?.chatId}
                          className={`flex justify-between items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                            selectedChat?.receiverId === chat?.receiverId
                              ? "bg-blue-400 dark:bg-blue-600"
                              : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            navigate(`/chat/${chat.receiverId}`);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={chat.receiverProfileImageUrl}
                              alt={chat.receiverFullname}
                              className="rounded-full w-10 h-10"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {chat.receiverFullname}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {chat.receiverUsername}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`w-3 h-3 rounded-full ${
                              chat.receiverStatus === "ONLINE"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          ></span>
                        </li>
                      ))}
                    </>
                  ) : (
                    <p className="pt-4 text-slate-500 text-center">
                      No conversations yet. <br />
                      Start a chat to connect with others!
                    </p>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col py-3 w-full md:w-[430px] lg:w-[450px] xl:w-[700px] h-full">
          <div className="flex flex-col flex-1 bg-white dark:bg-black p-4 rounded-lg w-full h-full">
            <div className="flex justify-between items-center mb-4 pb-2 border-gray-300 dark:border-gray-700 border-b">
              <div className="flex justify-between items-center px-3 w-full h-10 font-semibold">
                {selectedChat ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${selectedChat?.receiverId}`}>
                        <img
                          src={selectedChat?.receiverProfileImageUrl}
                          alt={selectedChat?.receiverFullname}
                          className="rounded-full w-10 h-10"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {selectedChat?.receiverFullname}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {selectedChat?.receiverUsername}
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          selectedChat.receiverStatus === "ONLINE"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <span className="cursor-pointer" onClick={toggleModal}>
                        <MoreVertRounded
                          sx={{
                            fontSize: { xs: 22, sm: 25, md: 28 },
                          }}
                        />
                      </span>

                      {isModalOpen && (
                        <div className="top-7 left-11 z-50 absolute flex flex-col bg-white dark:bg-black shadow-lg p-2 rounded-md w-48">
                          <div
                            className="hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md text-center whitespace-nowrap cursor-pointer"
                            onClick={openDeleteModal}
                          >
                            Delete All Messages
                          </div>
                        </div>
                      )}

                      <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        closeModal={closeDeleteModal}
                        confirmDelete={confirmDelete}
                        isDeleting={isDeleting}
                        type="MESSAGES"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-2xl">Select a user to chat</p>
                )}
              </div>
            </div>

            <ChatBox
              chatId={selectedChat?.chatId}
              receiverId={selectedChat?.receiverId}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
