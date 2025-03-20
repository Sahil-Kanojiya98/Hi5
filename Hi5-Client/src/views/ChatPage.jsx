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

  const loadNewChats = () => {
    loadData();
  };

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const setSelectedChatNull = () => {
  //   setSelectedChat(null);
  // };

  return (
    <MainLayout>
      <div className="flex justify-center md:ml-[6dvw] lg:ml-[20dvw] xl:ml-[19dvw] 2xl:ml-[10dvw] w-full md:max-w-3xl lg:max-w-3xl xl:max-w-5xl h-full">
        <div className="flex justify-center space-x-1 lg:space-x-3 my-0 md:my-4 px-4 w-full">
          <div className="flex flex-1 mt-16 md:mt-0 mb-12 md:mb-0 w-full md:max-w-[250px] lg:max-w-xs">
            <div className="flex flex-col bg-white dark:bg-black shadow-md p-4 rounded-lg w-full">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-7 w-full">
                <h2 className="font-bold text-xl">Users</h2>
                <div className="flex items-center gap-2">
                  <Link to="/search">
                    <button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-lg text-white text-sm sm:text-base whitespace-nowrap transition-all">
                      Search Users
                    </button>
                  </Link>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-lg text-white text-sm sm:text-base whitespace-nowrap transition-all"
                    onClick={loadNewChats}
                  >
                    New Chats
                  </button>
                </div>
              </div>

              <ul className="flex flex-col flex-1 rounded-md overflow-y-auto hide-scrollbar">
                {chatLoading ? (
                  <p className="pt-4 text-slate-500 text-sm md:text-base text-center">
                    Loading...
                  </p>
                ) : (
                  <>
                    {chats.length > 0 ? (
                      <>
                        {chats.map((chat) => (
                          <li
                            key={chat?.chatId}
                            className={`flex justify-between items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                              selectedChat?.receiverId === chat?.receiverId
                                ? "!bg-blue-400 dark:bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900"
                            }`}
                            onClick={() => {
                              navigate(`/chat/${chat.receiverId}`);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={chat.receiverProfileImageUrl}
                                alt={chat.receiverFullname}
                                className="rounded-full w-8 sm:w-10 h-8 sm:h-10"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm sm:text-base">
                                  {chat.receiverFullname}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                  {chat.receiverUsername}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                                chat.receiverStatus === "ONLINE"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            ></span>
                          </li>
                        ))}
                      </>
                    ) : (
                      <p className="pt-4 text-slate-500 text-sm md:text-base text-center">
                        No conversations yet. <br />
                        Start a chat to connect with others!
                      </p>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="hidden md:flex flex-col flex-1">
            <div className="flex flex-col flex-1 bg-white dark:bg-black shadow-md p-4 rounded-lg min-h-0">
              <div className="flex justify-between items-center mb-4 pb-2 border-gray-300 dark:border-gray-700 border-b">
                <div className="flex justify-between items-center px-3 w-full font-semibold">
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

          {/* <div className="md:hidden block relative">
            {selectedChat && <>
            <div className="z-20 fixed inset-0">
            </div>
            </>}
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
